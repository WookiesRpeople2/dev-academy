use actix_web::web;
use actix_web::{delete, get, post, put, HttpResponse};
use crate::dtos::programe::{ModuleWithLessons, ProgramDetail, UpdateCourseRequest};
use crate::models::programe::{Course, Lesson, Module};
use crate::service::AppServices;
use crate::traits::redis_trait::RedisCache;
use crate::{dtos::programe::CreateCourseRequest, error::ApiError};

#[get("/programs")]
pub async fn get_all_programs(services: web::Data<AppServices>)->Result<HttpResponse, ApiError> {
    if let Some(cached_programs) = services.cache.get::<Vec<Course>>("programs:all").await? {
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
    
    let course_vec: Vec<Course> = services.neo4j.query_nodes(
        "MATCH (c:Course {id: $course_id})
        RETURN c"
    )
    .param("course_id", course_id.clone())
    .fetch_key("c")
    .fetch::<Course>()
    .await?;

    
    let course = match course_vec.into_iter().next() {
        Some(c) => c,
        None => return Err(ApiError::NotFound(format!("Course {} not found", course_id))),
    };

    let modules: Vec<Module> = services.neo4j.query_nodes(
        "MATCH (c:Course {id: $course_id})-[:HAS_MODULE]->(m:Module)
        RETURN m"
    )
    .param("course_id", course_id.clone())
    .fetch_key("m")
    .fetch::<Module>()
    .await?;

    let lessons: Vec<Lesson> = services.neo4j.query_nodes(
        "MATCH (c:Course {id: $course_id})-[:HAS_MODULE]->(m:Module)-[:HAS_LESSON]->(l:Lesson)
        RETURN l"
    )
    .param("course_id", course_id.clone())
    .fetch_key("l")
    .fetch::<Lesson>()
    .await?;

    let modules_with_lessons: Vec<ModuleWithLessons> = modules.into_iter()
        .map(|m| ModuleWithLessons {
            module: m,
            lessons: lessons.clone(),
        })
        .collect();

    let program = ProgramDetail {
        course,
        modules: modules_with_lessons,
    };

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
    services.opensearch.index_course(&course).await?; 
    services.cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Created().json(course))
}

#[put("/programs/{id}")]
pub async fn update_program(
    path: web::Path<String>,
    req: web::Json<UpdateCourseRequest>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let course_id = path.into_inner();
    
    let mut query = "MATCH (c:Course {id: $course_id}) SET ".to_string();
    let mut updates = Vec::new();
    
    if let Some(title) = &req.title {
        updates.push(format!("c.title = '{}'", title.replace("'", "\\'")));
    }
    if let Some(description) = &req.description {
        updates.push(format!("c.description = '{}'", description.replace("'", "\\'")));
    }
    if let Some(status) = &req.status {
        updates.push(format!("c.status = '{}'", status));
    }
    if let Some(cover) = &req.cover {
        updates.push(format!("c.cover = '{}'", cover));
    }
    if let Some(prerequisites) = &req.prerequisites {
        let prereq_str = prerequisites
            .iter()
            .map(|p| format!("'{}'", p.replace("'", "\\'")))
            .collect::<Vec<_>>()
            .join(", ");
        updates.push(format!("c.prerequisites = [{}]", prereq_str));
    }
    if let Some(documents) = &req.documents {
        let doc_str = documents
            .iter()
            .map(|d| format!("'{}'", d.replace("'", "\\'")))
            .collect::<Vec<_>>()
            .join(", ");
        updates.push(format!("c.documents = [{}]", doc_str));
    }
    if let Some(duration) = &req.total_duration_minitues {
        updates.push(format!("c.total_duration_minutes = {}", duration));
    }
    
    if updates.is_empty() {
        return Err(ApiError::Internal("No fields to update".to_string()));
    }
    
    query.push_str(&updates.join(", "));
    query.push_str(" RETURN c");
    
    let updated_courses: Vec<Course> = services.neo4j
        .query_nodes(&query)
        .param("course_id", course_id.clone())
        .fetch_key("c")
        .fetch()
        .await?;
    
    if updated_courses.is_empty() {
        return Err(ApiError::NotFound("Program not found".to_string()));
    }
    
    if let Some(module_ids) = &req.module_ids {
        services.neo4j
            .query_nodes("MATCH (c:Course {id: $course_id})-[r:HAS_MODULE]->() DELETE r")
            .param("course_id", course_id.clone())
            .fetch::<Course>()
            .await?;
        
        for module_id in module_ids {
            let _ = services.neo4j.create_relationship(
                &course_id,
                module_id,
                "Course",
                "Module",
                "HAS_MODULE",
                None
            ).await;
        }
    }

    if let Some(updated_course) = updated_courses.get(0) {
        services.opensearch.index_course(updated_course).await?;
    }
    services.kafka.publish_cache_invalidation("course_updated", &course_id).await?;
    services.cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Ok().json(updated_courses.get(0)))
}

#[delete("/programs/{id}")]
pub async fn delete_program(
    path: web::Path<String>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let course_id = path.into_inner();

    services.neo4j
        .query_nodes("MATCH (c:Course {id: $course_id}) DETACH DELETE c")
        .param("course_id", course_id.clone())
        .fetch::<Course>()
        .await?;

    services.opensearch.delete_course(&course_id).await?;
    
    services.kafka.publish_cache_invalidation("course_deleted", &course_id).await?;
    
    services.cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Program deleted and cache invalidated"
    })))
}
