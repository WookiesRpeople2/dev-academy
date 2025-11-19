mod neo4j_query;
mod postgres_query;

pub mod neo4j_service;
pub mod postgres_service;
pub mod redis_cache_service;
pub mod kafka_service;
pub mod s3_service;
pub mod opensearch;

pub struct AppServices {
    pub cache: redis_cache_service::CacheService,
    pub neo4j: neo4j_service::Neo4jService,
    pub kafka: kafka_service::KafkaService,
    pub postgress: postgres_service::PostgresService,
    pub s3: s3_service::S3Service,
    pub opensearch: opensearch::OpenSearchService,
}
