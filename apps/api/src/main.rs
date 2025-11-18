use std::io;
use actix_web::{web, App, HttpServer};
use config::Config;

use crate::{service::{kafka_service::KafkaService, neo4j_service::Neo4jService, postgres_service::PostgresService, redis_cache_service::CacheService, s3_service::S3Service, AppServices}};

pub mod config;
pub mod error;
pub mod service;
pub mod traits;
pub mod dtos;
pub mod handlers;
pub mod models;
pub mod routes;

#[actix_web::main]
async fn main() -> io::Result<()> {
    let config = Config::new().await;
    let services = AppServices {
        cache: CacheService::new(config.redis.clone()),
        neo4j: Neo4jService::new(config.neo4j.clone()),
        kafka: KafkaService::new(config.kafka_producer.clone()),
        postgress: PostgresService::new(config.postgres.clone()),
        s3: S3Service::new(config.s3_client.clone())
    };
    let app_state = web::Data::new(config);
    let app_services = web::Data::new(services);
    

    HttpServer::new(move || {
        App::new()
        .app_data(app_state.clone())
        .app_data(app_services.clone())
        .service(
                web::scope("/api")
                    .configure(routes::programes::programs_routes)
                    .configure(routes::modules::modules_routes)
                    .configure(routes::lessons::lessons_routes)
            )
    })
    .bind("0.0.0.0:9090")?
    .run()
    .await
}
