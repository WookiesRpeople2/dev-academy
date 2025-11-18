use actix_web::web;
use actix_web::{delete, get, post, HttpResponse};
use crate::config::Config;
use crate::dtos::programe::ProgramDetail;
use crate::models::programe::Course;
use crate::traits::redis_trait::RedisCache;
use crate::{dtos::programe::CreateCourseRequest, error::ApiError, service::{kafka_service::KafkaService, neo4j_service::Neo4jService, redis_cache_service::CacheService}};

#[get("/programs")]
pub async fn get_all_programs(state: web::Data<Config>) -> Result<HttpResponse, ApiError> {
    let mut cache = CacheService::new(state.redis.clone());
    
    if let Some(cached_programs) = cache.get::<Course>("programs:all").await? {
        return Ok(HttpResponse::Ok().json(serde_json::json!({
            "programs": cached_programs,
            "source": "cache"
        })));
    }
    
    let neo4j = Neo4jService::new(state.neo4j.clone());
    let programs: Vec<Course> = neo4j
        .query_nodes("MATCH (c:Course) RETURN c")
        .fetch_key("c")
        .fetch()
        .await?;
    
    cache.set("programs:all", &programs, 300).await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "programs": programs,
        "source": "neo4j"
    })))
}

#[get("/programs/{id}")]
pub async fn get_program_by_id(
    path: web::Path<String>,
    state: web::Data<Config>,
) -> Result<HttpResponse, ApiError> {
    let course_id = path.into_inner();
    
    let mut cache = CacheService::new(state.redis.clone());
    let key = format!("programs:{}", course_id);
    
    if let Some(cached_program) = cache.get::<ProgramDetail>(&key).await? {
        return Ok(HttpResponse::Ok().json(serde_json::json!({
            "program": cached_program,
            "source": "cache"
        })));
    }
    
    let neo4j = Neo4jService::new(state.neo4j.clone());
    let program: Vec<ProgramDetail> = neo4j.query_nodes("MATCH (c:Course {id: $course_id}) 
        OPTIONAL MATCH (c)-[:HAS_MODULE]->(m:Module) 
        OPTIONAL MATCH (m)-[:HAS_LESSON]->(l:Lesson) 
        RETURN c, 
        collect(DISTINCT m) as modules, collect(DISTINCT l) as lessons"
        )
        .param("course_id", course_id.clone())
        .fetch::<ProgramDetail>()
        .await?;

    cache.set(&key, &program, 300).await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "program": program,
        "source": "neo4j"
    })))
}

#[post("/programs")]
pub async fn create_program(
    req: web::Json<CreateCourseRequest>,
    state: web::Data<Config>,
) -> Result<HttpResponse, ApiError> {
    let neo4j = Neo4jService::new(state.neo4j.clone());
    let course: Course = neo4j.create_node("Course")
    .prop("title", &*req.title)
    .prop("description", &*req.description)
    .prop("status", &*req.status)
    .exec()
    .await?;
    
    let kafka = KafkaService::new(state.kafka_producer.clone());
    kafka.publish_cache_invalidation("course_created", &course.id).await?;
    
    let mut cache = CacheService::new(state.redis.clone());
    cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Created().json(course))
}

#[delete("/programs/{id}")]
pub async fn delete_program(
    path: web::Path<String>,
    state: web::Data<Config>,
) -> Result<HttpResponse, ApiError> {
    let course_id = path.into_inner();
    
    let kafka = KafkaService::new(state.kafka_producer.clone());
    kafka.publish_cache_invalidation("course_deleted", &course_id).await?;
    
    let mut cache = CacheService::new(state.redis.clone());
    cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Program deleted and cache invalidated"
    })))
}
