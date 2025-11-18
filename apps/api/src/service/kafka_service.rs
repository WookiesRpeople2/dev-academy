use rdkafka::producer::{FutureProducer, FutureRecord};
use std::{sync::Arc, time::Duration};

use crate::{dtos::events::CacheInvalidationEvent, error::ApiError};

pub struct KafkaService {
   producer: Arc<FutureProducer>,
}

impl KafkaService {
    pub fn new(producer: Arc<FutureProducer>) -> Self {
        Self { producer}
    }


    pub async fn publish_cache_invalidation(&self, event_type: &str, resource_id: &str) -> Result<(), ApiError> {
        let event = CacheInvalidationEvent {
            event_type: event_type.to_string(),
            resource_id: resource_id.to_string(),
            timestamp: chrono::Utc::now().timestamp(),
        };

        let payload = serde_json::to_string(&event)
            .map_err(|e| ApiError::Internal(e.to_string()))?;

        let record = FutureRecord::to("cache-invalidation")
            .payload(&payload)
            .key(resource_id);

        self.producer
            .send(record, Duration::from_secs(15))
            .await
            .map_err(|(e, _)| ApiError::Internal(format!("Kafka error: {:?}", e)))?;

        Ok(())
    }
}

