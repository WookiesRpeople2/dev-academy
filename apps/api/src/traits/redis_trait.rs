use async_trait::async_trait;
use serde::{Serialize, de::DeserializeOwned};
use crate::error::ApiError;

#[async_trait]
pub trait RedisCache: Send + Sync {
    async fn get<T>(&self, key: &str) -> Result<Option<T>, ApiError>
    where
        T: DeserializeOwned + Send + Sync;

    async fn set<T>(&self, key: &str, value: &T, ttl_seconds: u64) -> Result<(), ApiError>
    where
        T: Serialize + Send + Sync;

    async fn delete(&self, key: &str) -> Result<(), ApiError>;

    async fn delete_all(&self, pattern: &str) -> Result<(), ApiError>;
}


