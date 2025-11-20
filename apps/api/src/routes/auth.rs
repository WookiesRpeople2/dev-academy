use actix_web::web;

use crate::{handlers::auth, middleware::auth_middleware::AuthMiddleware};

pub fn auth_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/auth")
            .service(auth::signup)
            .service(auth::login_password)
            .service(auth::register_passkey)
            .service(auth::login_passkey)
            .service(
                web::scope("")
                    .wrap(AuthMiddleware::new())
                    .service(auth::get_current_user)
            )
    );
}

