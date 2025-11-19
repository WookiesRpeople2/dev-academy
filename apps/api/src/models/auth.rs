use chrono::{NaiveDateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;
use sqlx::types::Uuid;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub username: String,
    pub full_name: String,
    pub password_hash: Option<String>,
    pub password_salt: Option<String>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Passkey {
    pub id: String,
    pub user_id: String,
    pub credential_id: String,
    pub public_key: String,
    pub counter: i64,
    pub created_at: NaiveDateTime,
}

impl User {
    pub fn new() -> Self {
        let now = Utc::now().naive_utc();
        Self {
            id: Uuid::new_v4(),
            email: String::new(),
            username: String::new(),
            full_name: String::new(),
            password_hash: Some(String::new()),
            password_salt: Some(String::new()),
            created_at: now,
            updated_at: now,
        }
    }
}
