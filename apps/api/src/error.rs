use thiserror::Error;

#[derive(Error, Debug)]
pub enum ApiError {
    #[error("Neo4j error: {0}")]
    Neo4j(#[from] neo4rs::Error),
    
    #[error("Redis error: {0}")]
    Redis(#[from] redis::RedisError),
    
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
    
    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),
    
    #[error("Not found: {0}")]
    NotFound(String),
    
    #[error("Internal error: {0}")]
    Internal(String),
}

impl actix_web::ResponseError for ApiError {
    fn error_response(&self) -> actix_web::HttpResponse {
        use actix_web::http::StatusCode;
        
        let status = match self {
            ApiError::NotFound(_) => StatusCode::NOT_FOUND,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        };
        
        actix_web::HttpResponse::build(status).json(serde_json::json!({
            "error": self.to_string()
        }))
    }
}
