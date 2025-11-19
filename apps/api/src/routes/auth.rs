use actix_web::web;

use crate::handlers::auth;

pub fn auth_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(auth::signup)
       .service(auth::login_password);
}

