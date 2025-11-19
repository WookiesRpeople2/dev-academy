use std::num::NonZeroU32;
use base64::{engine::general_purpose, Engine as _};
use aes_gcm::{
    aead::{rand_core::RngCore, Aead, KeyInit, OsRng},
    Aes256Gcm, Key, Nonce
};
use chrono::{TimeDelta, Utc};
use jsonwebtoken::{encode, decode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use pbkdf2::pbkdf2_hmac;
use sha2::Sha256;
use crate::{dtos::auth::Claims, error::ApiError, models::auth::User};



pub const ITER: u32 = 10000;
pub const SALT_LEN: usize = 16;
pub const KEY_LEN: usize = 32;
pub struct JwtService {
    pub jwt_secret: String,
    pub encryption_key: Vec<u8>,
}

impl JwtService {
    pub fn new(jwt_secret: String, encryption_key: Vec<u8>) -> Self {
        Self { jwt_secret, encryption_key }
    }

    pub fn derive_key(&self, salt: &[u8]) -> [u8; KEY_LEN] {
        let mut key = [0u8; KEY_LEN];
        pbkdf2_hmac::<Sha256>(&self.encryption_key, salt, NonZeroU32::new(ITER).unwrap().into(), &mut key);
        key
    }

    pub fn encrypt_token(&self, token: &str) -> Result<String, ApiError> {
        let mut salt = [0u8; SALT_LEN];
        let _ = OsRng.try_fill_bytes(&mut salt);

        let key_bytes = self.derive_key(&salt);
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&key_bytes));

        let mut nonce_bytes = [0u8; 12];
        OsRng.fill_bytes(&mut nonce_bytes);

        let ciphertext = cipher.encrypt(Nonce::from_slice(&nonce_bytes), token.as_bytes())
            .map_err(|_| ApiError::Internal("Encryption failed".into()))?;

        let mut out = Vec::new();
        out.extend_from_slice(&salt);
        out.extend_from_slice(&nonce_bytes);
        out.extend_from_slice(&ciphertext);

        Ok(general_purpose::STANDARD.encode(out))
    }

    pub fn decrypt_token(&self, token_b64: &str) -> Result<String, ApiError> {
        let data = general_purpose::STANDARD.decode(token_b64)
            .map_err(|_| ApiError::Internal("Invalid token".into()))?;

        if data.len() < SALT_LEN + 12 {
            return Err(ApiError::Internal("Malformed token".into()));
        }

        let salt = &data[..SALT_LEN];
        let nonce_bytes = &data[SALT_LEN..SALT_LEN + 12];
        let ciphertext = &data[SALT_LEN + 12..];

        let key_bytes = self.derive_key(salt);
        let cipher = Aes256Gcm::new(Key::<Aes256Gcm>::from_slice(&key_bytes));

        let plaintext = cipher.decrypt(Nonce::from_slice(nonce_bytes), ciphertext)
            .map_err(|_| ApiError::Internal("Decryption failed".into()))?;

        String::from_utf8(plaintext).map_err(|_| ApiError::Internal("Invalid UTF-8".into()))
    }

    pub fn generate_jwt(&self, user: &User) -> Result<String, ApiError> {
        let expiration = Utc::now()
            .checked_add_signed(TimeDelta::hours(24))
            .ok_or_else(|| ApiError::Internal("Failed to calculate expiration".to_string()))?
            .timestamp();

        let claims = Claims {
            sub: user.id.to_string(),
            email: user.email.clone(),
            username: user.username.clone(),
            exp: expiration,
            iat: Utc::now().timestamp(),
        };

        encode(&Header::default(), &claims, &EncodingKey::from_secret(self.jwt_secret.as_bytes()))
            .map_err(|e| ApiError::Internal(format!("JWT encoding failed: {}", e)))
    }

    pub fn verify_jwt(&self, token: &str) -> Result<Claims, ApiError> {
        decode::<Claims>(
            token,
            &DecodingKey::from_secret(self.jwt_secret.as_bytes()),
            &Validation::new(Algorithm::HS256),
        )
        .map(|data| data.claims)
        .map_err(|e| ApiError::Internal(format!("Invalid token: {}", e)))
    }
}
