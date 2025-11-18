use std::sync::Arc;
use aws_config::{BehaviorVersion, Region};
use aws_sdk_s3::config::Credentials;
use dotenv::dotenv;
use sqlx::PgPool;
use redis::Client;
use aws_sdk_s3::Client as S3Client;
use rdkafka::producer::FutureProducer;
use rdkafka::config::ClientConfig;
use neo4rs::Graph;
use std::env;

pub struct Config {
    pub neo4j: Arc<Graph>,
    pub redis: Client,
    pub postgres: PgPool,
    pub kafka_producer: Arc<FutureProducer>,
    pub s3_client: Arc<S3Client>,
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
        let region = env::var("AWS_REGION").unwrap_or_else(|_| "us-east-1".to_string());
        let cred_username = env::var("AWS_ACCESS_KEY_ID").expect("AWS_ACCESS_KEY_ID is missing");
        let cred_pass = env::var("AWS_SECRET_ACCESS_KEY").expect("AWS_SECRET_ACCESS_KEY is missing");
        let endpoint = env::var("S3_ENDPOINT_URL").expect("S3_ENDPOINT_URL is missing");

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

        let aws_conf = aws_sdk_s3::Config::builder()
        .behavior_version(BehaviorVersion::latest())
        .region(Region::new(region))
        .endpoint_url(endpoint)
        .credentials_provider(Credentials::new(
            cred_username,
            cred_pass,
            None,
            None,
            "localstack"
        ))
        .force_path_style(true)  
        .build();

        let s3_client = Arc::new(S3Client::from_conf(aws_conf));

        Self {
            neo4j,
            redis,
            s3_client,
            postgres,
            kafka_producer,
        }
    }
}

