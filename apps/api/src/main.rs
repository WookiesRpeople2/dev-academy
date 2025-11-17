use std::{env, io};

use actix_web::{App, HttpServer};



#[actix_web::main]
async fn main() -> io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .service(tweet::list)
            .service(tweet::get)
            .service(tweet::create)
            .service(tweet::delete)
            .service(like::list)
            .service(like::plus_one)
            .service(like::minus_one)
    })
    .bind("0.0.0.0:9090")?
    .run()
    .await
}
