use actix_web::web;
use actix_web::{delete, get, post, HttpResponse};
use crate::dtos::programe::ProgramDetail;
use crate::models::programe::Course;
use crate::service::AppServices;
use crate::traits::redis_trait::RedisCache;
use crate::{dtos::programe::CreateCourseRequest, error::ApiError};

#[get("/programs")]
pub async fn get_all_programs(services: web::Data<AppServices>)->Result<HttpResponse, ApiError> {
    if let Some(cached_programs) = services.cache.get::<Course>("programs:all").await? {
        return Ok(HttpResponse::Ok().json(serde_json::json!({
            "programs": cached_programs,
            "source": "cache"
        })));
    }
    
    let programs: Vec<Course> = services.neo4j
        .query_nodes("MATCH (c:Course) RETURN c")
        .fetch_key("c")
        .fetch()
        .await?;
    
    services.cache.set("programs:all", &programs, 300).await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "programs": programs,
        "source": "neo4j"
    })))
}

#[get("/programs/{id}")]
pub async fn get_program_by_id(
    path: web::Path<String>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let course_id = path.into_inner();
    
    let key = format!("programs:{}", course_id);
    
    if let Some(cached_program) = services.cache.get::<ProgramDetail>(&key).await? {
        return Ok(HttpResponse::Ok().json(serde_json::json!({
            "program": cached_program,
            "source": "cache"
        })));
    }
    
    let program: Vec<ProgramDetail> = services.neo4j.query_nodes("MATCH (c:Course {id: $course_id}) 
        OPTIONAL MATCH (c)-[:HAS_MODULE]->(m:Module) 
        OPTIONAL MATCH (m)-[:HAS_LESSON]->(l:Lesson) 
        RETURN c, 
        collect(DISTINCT m) as modules, collect(DISTINCT l) as lessons"
        )
        .param("course_id", course_id.clone())
        .fetch::<ProgramDetail>()
        .await?;

    services.cache.set(&key, &program, 300).await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "program": program,
        "source": "neo4j"
    })))
}

#[post("/programs")]
pub async fn create_program(
    req: web::Json<CreateCourseRequest>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    
    let course: Course = services.neo4j.create_node("Course")
    .prop("title", &*req.title)
    .prop("description", &*req.description)
    .prop("status", &*req.status)
    .prop("cover", &*req.cover)
    .prop("prerequisites", &*req.prerequisites)
    .prop("documents", &*req.documents)
    .prop("total_duration_minutes", &*req.total_duration_minitues)
    .exec()
    .await?;
   
    for m in &*req.module_ids{
        let _ = services.neo4j.create_relationship(&course.id, m, "Course", "Module", "HAS_MODULE", None);
    }

    services.kafka.publish_cache_invalidation("course_created", &course.id).await?;
    
    services.cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Created().json(course))
}

#[delete("/programs/{id}")]
pub async fn delete_program(
    path: web::Path<String>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let course_id = path.into_inner();
    
    services.kafka.publish_cache_invalidation("course_deleted", &course_id).await?;
    
    services.cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Program deleted and cache invalidated"
    })))
}
