use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize)]
pub struct CacheInvalidationEvent {
    pub event_type: String,
    pub resource_id: String,
    pub timestamp: i64,
}
