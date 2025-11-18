use actix_web::web;
use actix_web::{delete, get, post, put, HttpResponse};
use crate::dtos::lessons::{CreateLessonRequest, UpdateLessonRequest};
use crate::models::programe::Lesson;
use crate::service::AppServices;
use crate::traits::redis_trait::RedisCache;
use crate::error::ApiError;

#[get("/lessons")]
pub async fn get_all_lessons(services: web::Data<AppServices>) -> Result<HttpResponse, ApiError> {
    if let Some(cached_lessons) = services.cache.get::<Vec<Lesson>>("lessons:all").await? {
        return Ok(HttpResponse::Ok().json(serde_json::json!({
            "lessons": cached_lessons,
            "source": "cache"
        })));
    }
    
    let lessons: Vec<Lesson> = services.neo4j
        .query_nodes("MATCH (l:Lesson) RETURN l ORDER BY l.order")
        .fetch_key("l")
        .fetch()
        .await?;
    
    services.cache.set("lessons:all", &lessons, 300).await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "lessons": lessons,
        "source": "neo4j"
    })))
}

#[get("/lessons/{id}")]
pub async fn get_lesson_by_id(
    path: web::Path<String>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let lesson_id = path.into_inner();
    let key = format!("lessons:{}", lesson_id);
    
    if let Some(cached_lesson) = services.cache.get::<Lesson>(&key).await? {
        return Ok(HttpResponse::Ok().json(serde_json::json!({
            "lesson": cached_lesson,
            "source": "cache"
        })));
    }
    
    let lessons: Vec<Lesson> = services.neo4j
        .query_nodes("MATCH (l:Lesson {id: $lesson_id}) RETURN l")
        .param("lesson_id", lesson_id.clone())
        .fetch_key("l")
        .fetch()
        .await?;
    
    if lessons.is_empty() {
        return Err(ApiError::NotFound("Lesson not found".to_string()));
    }
    
    services.cache.set(&key, &lessons[0], 300).await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "lesson": lessons[0],
        "source": "neo4j"
    })))
}

#[post("/lessons")]
pub async fn create_lesson(
    req: web::Json<CreateLessonRequest>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let lesson: Lesson = services.neo4j
        .create_node("Lesson")
        .prop("title", &*req.title)
        .prop("order", req.order)
        .prop("duration_minutes", req.duration_minutes)
        .prop("prerequisites", &*req.prerequisites)
        .prop("completed", false)
        .prop("video", &*req.video)
        .exec()
        .await?;
    
    services.kafka.publish_cache_invalidation("lesson_created", &lesson.id).await?;
    services.cache.delete_all("lessons:*").await?;
    services.cache.delete_all("modules:*").await?;
    services.cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Created().json(lesson))
}

#[put("/lessons/{id}")]
pub async fn update_lesson(
    path: web::Path<String>,
    req: web::Json<UpdateLessonRequest>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let lesson_id = path.into_inner();
    
    let mut query = "MATCH (l:Lesson {id: $lesson_id}) SET ".to_string();
    let mut updates = Vec::new();
    
    if let Some(title) = &req.title {
        updates.push(format!("l.title = '{}'", title.replace("'", "\\'")));
    }
    if let Some(order) = req.order {
        updates.push(format!("l.order = {}", order));
    }
    if let Some(duration) = req.duration_minutes {
        updates.push(format!("l.duration_minutes = {}", duration));
    }
    if let Some(prerequisites) = &req.prerequisites {
        let prereq_str = prerequisites
            .iter()
            .map(|p| format!("'{}'", p.replace("'", "\\'")))
            .collect::<Vec<_>>()
            .join(", ");
        updates.push(format!("l.prerequisites = [{}]", prereq_str));
    }
    if let Some(completed) = req.completed {
        updates.push(format!("l.completed = {}", completed));
    }
    if let Some(video) = &req.video {
        updates.push(format!("l.video = '{}'", video.replace("'", "\\'")));
    }
    
    if updates.is_empty() {
        return Err(ApiError::Internal("No fields to update".to_string()));
    }
    
    query.push_str(&updates.join(", "));
    query.push_str(" RETURN l");
    
    let updated_lessons: Vec<Lesson> = services.neo4j
        .query_nodes(&query)
        .param("lesson_id", lesson_id.clone())
        .fetch_key("l")
        .fetch()
        .await?;
    
    if updated_lessons.is_empty() {
        return Err(ApiError::NotFound("Lesson not found".to_string()));
    }
    
    services.kafka.publish_cache_invalidation("lesson_updated", &lesson_id).await?;
    services.cache.delete_all("lessons:*").await?;
    services.cache.delete_all("modules:*").await?;
    services.cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Ok().json(updated_lessons.get(0)))
}

#[delete("/lessons/{id}")]
pub async fn delete_lesson(
    path: web::Path<String>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let lesson_id = path.into_inner();
    
    // Delete lesson and its relationships
    services.neo4j
        .query_nodes(
            "MATCH (l:Lesson {id: $lesson_id})
             DETACH DELETE l"
        )
        .param("lesson_id", lesson_id.clone())
        .fetch::<Lesson>()
        .await?;
    
    services.kafka.publish_cache_invalidation("lesson_deleted", &lesson_id).await?;
    services.cache.delete_all("lessons:*").await?;
    services.cache.delete_all("modules:*").await?;
    services.cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Lesson deleted and cache invalidated"
    })))
}

#[put("/lessons/{id}/complete")]
pub async fn mark_lesson_complete(
    path: web::Path<String>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let lesson_id = path.into_inner();
    
    let updated_lessons: Vec<Lesson> = services.neo4j
        .query_nodes(
            "MATCH (l:Lesson {id: $lesson_id})
             SET l.completed = true
             RETURN l"
        )
        .param("lesson_id", lesson_id.clone())
        .fetch_key("l")
        .fetch()
        .await?;
    
    if updated_lessons.is_empty() {
        return Err(ApiError::NotFound("Lesson not found".to_string()));
    }
    
    services.kafka.publish_cache_invalidation("lesson_completed", &lesson_id).await?;
    services.cache.delete(&format!("lessons:{}", lesson_id)).await?;
    
    Ok(HttpResponse::Ok().json(updated_lessons.get(0)))
}
