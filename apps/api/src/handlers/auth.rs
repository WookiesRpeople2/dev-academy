use std::num::NonZeroU32;
use pbkdf2::pbkdf2_hmac;
use sha2::Sha256;
use subtle::ConstantTimeEq;
use actix_web::{web, HttpResponse, post, cookie::Cookie, cookie::SameSite};
use aes_gcm::aead::{rand_core::RngCore, OsRng};

use crate::{dtos::auth::{AuthResponse, LoginPasswordRequest, SignupRequest}, error::ApiError, models::auth::User, service::{jwt_service::{ITER, KEY_LEN, SALT_LEN}, AppServices}};



pub fn hash_password(password: &[u8]) -> (Vec<u8>, Vec<u8>) {
    let mut salt = vec![0u8; SALT_LEN];
    let _ = OsRng.fill_bytes(&mut salt);

    let mut hash = vec![0u8; KEY_LEN];
    let iterations = NonZeroU32::new(ITER).expect("iterations must be non-zero");

    pbkdf2_hmac::<Sha256>(password, &salt, iterations.into(), &mut hash);

    (hash, salt)
}

pub fn verify_password(password: &[u8], salt: &[u8], expected_hash: &[u8]) -> bool {
    let mut computed = vec![0u8; expected_hash.len()];
    let iterations = NonZeroU32::new(ITER).expect("Non-zero iterations required");

    pbkdf2_hmac::<Sha256>(password, salt, iterations.into(), &mut computed);

    computed.ct_eq(expected_hash).into()
}

#[post("/auth/signup/password")]
pub async fn signup(
    req: web::Json<SignupRequest>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let req = req.into_inner();
    let existing: Vec<User> = services
        .postgress
        .query("SELECT * FROM users WHERE email = $1")
        .bind(&req.email)
        .fetch_all()
        .await?;

    if !existing.is_empty() {
        return Err(ApiError::Internal("Email already registered".into()));
    }

    let (hash, salt) = if let Some(password) = &req.password {
        hash_password(password.as_bytes())
    } else {
        return Err(ApiError::Internal("Password is required".into()));
    };

    let user: User = services
        .postgress
        .insert("users")
        .value("email", req.email.as_str())
        .value("username", req.username.as_str())
        .value("full_name", req.full_name.as_str())
        .value("password_hash", hex::encode(&hash))  
        .value("password_salt", hex::encode(&salt))  
        .returning("*")
        .fetch_one()
        .await?;

    let token = services.jwt_service.generate_jwt(&user)?;
    let encrypted_token = services.jwt_service.encrypt_token(&token)?;

    let cookie = Cookie::build("auth_token", encrypted_token)
        .path("/")
        .max_age(actix_web::cookie::time::Duration::days(1))
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Strict)
        .finish();

    Ok(HttpResponse::Created().cookie(cookie).json(AuthResponse {
        user_id: user.id.to_string(),
        email: user.email.clone(),
        username: user.username.clone(),
        token,
    }))
}

#[post("/auth/login/password")]
pub async fn login_password(
    req: web::Json<LoginPasswordRequest>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let users: Vec<User> = services
        .postgress
        .query("SELECT * FROM users WHERE email = $1")
        .bind(&req.email)
        .fetch_all()
        .await?;

    let user = users.first().ok_or_else(|| ApiError::Internal("Invalid credentials".into()))?;

    let password_hash = user.password_hash.as_ref()
        .ok_or_else(|| ApiError::Internal("Password login not enabled".into()))?;

    let password_salt = user.password_salt.as_ref()
        .ok_or_else(|| ApiError::Internal("Missing salt".into()))?;

    if !verify_password(req.password.as_bytes(), password_salt.as_bytes(), password_hash.as_bytes()) {
        return Err(ApiError::Internal("Invalid credentials".into()));
    }

    let token = services.jwt_service.generate_jwt(user)?;
    let encrypted_token = services.jwt_service.encrypt_token(&token)?;

    let cookie = Cookie::build("auth_token", encrypted_token)
        .path("/")
        .max_age(actix_web::cookie::time::Duration::days(1))
        .http_only(true)
        .secure(true)
        .same_site(SameSite::Strict)
        .finish();

    Ok(HttpResponse::Ok().cookie(cookie).json(AuthResponse {
        user_id: user.id.to_string(),
        email: user.email.clone(),
        username: user.username.clone(),
        token,
    }))
}
