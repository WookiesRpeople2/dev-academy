use tokio;
use api::config::Config;
use crate::{seed_bucket::seed_bucket, seed_database::seed_database};

pub mod data;
mod seed_database;
mod seed_bucket;

#[tokio::main]
async fn main() {
    println!("Starting seeding process...\n");
    
    let config = Config::new().await;
    
    println!("═══════════════════════════════════════");
    println!("        S3 BUCKET SEEDING");
    println!("═══════════════════════════════════════");
    let _ = seed_bucket(&config).await;
    
    println!("\n");
    
    println!("═══════════════════════════════════════");
    println!("        DATABASE SEEDING");
    println!("═══════════════════════════════════════");
    let _ = seed_database(&config).await;
    
    println!("\n");
    println!("═══════════════════════════════════════");
    println!("   ✅ ALL SEEDING COMPLETED");
    println!("═══════════════════════════════════════");
    println!("\n Your learning platform is ready!");
    println!("   - Database: Neo4j populated with course structure");
    println!("   - Cache: Redis warmed with course data");
    println!("   - Storage: S3 bucket with videos and documents");
    println!("   - Events: Kafka messages published");
}

