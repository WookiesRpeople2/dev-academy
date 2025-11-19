use actix_web::web;

use crate::handlers::lessons;

pub fn lessons_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(lessons::get_all_lessons)
       .service(lessons::get_lesson_by_id)
       .service(lessons::create_lesson)
       .service(lessons::update_lesson)
       .service(lessons::delete_lesson)
       .service(lessons::mark_lesson_complete);
}

