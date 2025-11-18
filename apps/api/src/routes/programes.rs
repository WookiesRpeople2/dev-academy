use actix_web::web;
use crate::handlers::programes;

pub fn programs_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(programes::get_all_programs)
       .service(programes::get_program_by_id)
       .service(programes::create_program)
       .service(programes::update_program)
       .service(programes::delete_program);
}

