use redis::{AsyncCommands, Client};
use serde::{Serialize, de::DeserializeOwned};
use crate::{error::ApiError, traits::redis_trait::RedisCache};

pub struct CacheService {
    client: Client,
}

impl CacheService {
    pub fn new(client: Client) -> Self {
        Self { client }
    }

    async fn conn(&self) -> Result<redis::aio::MultiplexedConnection, ApiError> {
        let con = self.client.get_multiplexed_async_connection().await?;
        Ok(con)
    }
}

impl RedisCache for CacheService {
    async fn get<T: DeserializeOwned>(&mut self, key: &str) -> Result<Option<T>, ApiError> {
        let cached: Option<String> = self.conn().await?.get(key).await?;

        match cached {
            Some(json) => {
                let parsed: T = serde_json::from_str(&json)?;
                Ok(Some(parsed))
            }
            None => Ok(None),
        }
    }

    async fn set<T: Serialize>(&mut self, key: &str, value: &T, ttl_seconds: u64) -> Result<(), ApiError> {
        let mut con = self.conn().await?;
        let json = serde_json::to_string(value)?;
        let _: () = con.set_ex(key, json, ttl_seconds).await?;
        Ok(())
    }

    async fn delete(&mut self, key: &str) -> Result<(), ApiError> {
        let mut con = self.conn().await?;
        let _: () = con.del(key).await?;
        Ok(())
    }


    async fn delete_all(&mut self, pattern: &str) -> Result<(), ApiError> {
        let mut con = self.conn().await?;
        let mut cursor: u64 = 0;

        loop {
            let (next_cursor, keys): (u64, Vec<String>) =
                redis::cmd("SCAN")
                    .arg(cursor)
                    .arg("MATCH")
                    .arg(pattern)
                    .arg("COUNT")
                    .arg(100)
                    .query_async(&mut con)
                    .await?;

            for key in keys {
                let _: () = con.del(&key).await?;
            }

            if next_cursor == 0 {
                break;
            }
            cursor = next_cursor;
        }

        Ok(())
    }
}
