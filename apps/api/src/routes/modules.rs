use actix_web::web;

use crate::handlers::modules;


pub fn modules_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(modules::get_all_modules)
       .service(modules::get_module_by_id)
       .service(modules::create_module)
       .service(modules::update_module)
       .service(modules::delete_module);
}

