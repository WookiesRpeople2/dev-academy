use serde::{de::DeserializeOwned, Serialize};
use crate::error::ApiError;

#[allow(async_fn_in_trait)]
pub trait RedisCache {
    async fn get<T: DeserializeOwned>(&mut self, key: &str) -> Result<Option<T>, ApiError>;
    async fn set<T: Serialize>(&mut self, key: &str, value: &T, ttl_seconds: u64) -> Result<(), ApiError>;
    async fn delete(&mut self, key: &str) -> Result<(), ApiError>;
    async fn delete_all(&mut self, pattern: &str) -> Result<(), ApiError>;
}


