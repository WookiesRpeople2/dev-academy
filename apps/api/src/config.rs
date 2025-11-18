use std::sync::Arc;
use dotenv::dotenv;
use sqlx::PgPool;
use redis::Client;
use rdkafka::producer::FutureProducer;
use rdkafka::config::ClientConfig;
use neo4rs::Graph;
use std::env;

pub struct Config {
    pub neo4j: Arc<Graph>,
    pub redis: Client,
    pub postgres: PgPool,
    pub kafka_producer: Arc<FutureProducer>,
}

impl Config {
    pub async fn new() -> Self {
        dotenv().ok();

        let neo4j_url = env::var("NEO4J_URL").expect("NEO4J_URL missing");
        let neo4j_user = env::var("NEO4J_USER").expect("NEO4J_USER missing");
        let neo4j_pass = env::var("NEO4J_PASS").expect("NEO4J_PASS missing");
        let redis_url = env::var("REDIS_URL").expect("REDIS_URL missing");
        let postgres_url = env::var("POSTGRES_URL").expect("POSTGRES_URL missing");
        let kafka_url = env::var("KAFKA_URL").expect("KAFKA_URL missing");

        let neo4j = Arc::new(
            Graph::new(&neo4j_url, &neo4j_user, &neo4j_pass)
                .await
                .expect("Failed to connect to Neo4j"),
        );

        let redis = redis::Client::open(redis_url)
            .expect("Invalid connection URL");
      

        let postgres = PgPool::connect(&postgres_url)
            .await
            .expect("Failed to connect to Postgres");

        let kafka_producer = Arc::new(
            ClientConfig::new()
                .set("bootstrap.servers", &kafka_url)
                .set("message.timeout.ms", "5000")
                .create()
                .expect("Failed to create Kafka producer"),
        );

        Self {
            neo4j,
            redis,
            postgres,
            kafka_producer,
        }
    }
}

