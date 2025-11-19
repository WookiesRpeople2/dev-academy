use actix_web::web;

use crate::handlers::search;

pub fn program_search_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(search::search_programs)
       .service(search::filter_programs)
       .service(search::advanced_search_programs);
}

