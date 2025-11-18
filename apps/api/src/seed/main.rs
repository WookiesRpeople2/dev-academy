use tokio;
use api::config::Config;
use crate::seed_database::seed_database;

pub mod data;
mod seed_database;

#[tokio::main]
async fn main() {
    println!("Loading config...");
    let config = Config::new().await;

    println!("Seeding database...");
    if let Err(err) = seed_database(&config).await {
        eprintln!("Database seeding failed: {:?}", err);
        std::process::exit(1);
    }

    println!("Seeding completed successfully!");
}

