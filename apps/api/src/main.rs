use std::io;
use actix_web::{web, App, HttpServer};
use config::Config;

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
    let app_state = web::Data::new(config);

    HttpServer::new(move || {
        App::new()
        .app_data(app_state.clone())
        .service(
                web::scope("/api")
                    .configure(routes::programes::programs_routes)
            )
    })
    .bind("0.0.0.0:9090")?
    .run()
    .await
}
