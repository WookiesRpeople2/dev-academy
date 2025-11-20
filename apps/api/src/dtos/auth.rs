use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct SignupRequest {
    pub email: String,
    pub password: Option<String>,
    pub username: String,
    pub full_name: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginPasswordRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginPasskeyRequest {
    pub email: String,
    pub credential_id: String,
    pub authenticator_data: String,
    pub client_data: String,
    pub signature: String,
}

#[derive(Debug, Deserialize)]
pub struct RegisterPasskeyRequest {
    pub email: String,
    pub credential_id: String,
    pub public_key: String,
    pub counter: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub email: String,
    pub exp: i64,         
    pub iat: i64,         
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub user_id: String,
    pub email: String,
    pub username: String,
    pub token: String,
}

