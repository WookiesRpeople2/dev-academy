use actix_web::web;
use actix_web::{delete, get, post, put, HttpResponse};
use crate::dtos::modules::{CreateModuleRequest, UpdateModuleRequest};
use crate::dtos::programe::ModuleWithLessons;
use crate::models::programe::Module;
use crate::service::AppServices;
use crate::traits::redis_trait::RedisCache;
use crate::error::ApiError;

#[get("/modules")]
pub async fn get_all_modules(services: web::Data<AppServices>) -> Result<HttpResponse, ApiError> {
    if let Some(cached_modules) = services.cache.get::<Vec<Module>>("modules:all").await? {
        return Ok(HttpResponse::Ok().json(serde_json::json!({
            "modules": cached_modules,
            "source": "cache"
        })));
    }
    
    let modules: Vec<Module> = services.neo4j
        .query_nodes("MATCH (m:Module) RETURN m")
        .fetch_key("m")
        .fetch()
        .await?;
    
    services.cache.set("modules:all", &modules, 300).await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "modules": modules,
        "source": "neo4j"
    })))
}

#[get("/modules/{id}")]
pub async fn get_module_by_id(
    path: web::Path<String>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let module_id = path.into_inner();
    let key = format!("modules:{}", module_id);
    
    if let Some(cached_module) = services.cache.get::<ModuleWithLessons>(&key).await? {
        return Ok(HttpResponse::Ok().json(serde_json::json!({
            "module": cached_module,
            "source": "cache"
        })));
    }
    
    let module_details: Vec<ModuleWithLessons> = services.neo4j
        .query_nodes(
            "MATCH (m:Module {id: $module_id})
             OPTIONAL MATCH (m)-[:HAS_LESSON]->(l:Lesson)
             RETURN m, collect(DISTINCT l) as lessons"
        )
        .param("module_id", module_id.clone())
        .fetch::<ModuleWithLessons>()
        .await?;
    
    if module_details.is_empty() {
        return Err(ApiError::NotFound("Module not found".to_string()));
    }
    
    services.cache.set(&key, &module_details[0], 300).await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "module": module_details[0],
        "source": "neo4j"
    })))
}

#[post("/modules")]
pub async fn create_module(
    req: web::Json<CreateModuleRequest>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let module: Module = services.neo4j
        .create_node("Module")
        .prop("title", &*req.title)
        .prop("order", req.order)
        .prop("module_duration_minutes", req.module_duration_minutes)
        .exec()
        .await?;
    
    for lesson_id in &req.lesson_ids {
        let _ = services.neo4j.create_relationship(
            &module.id,
            lesson_id,
            "Module",
            "Lesson",
            "HAS_LESSON",
            None
        ).await;
    }
    
    services.kafka.publish_cache_invalidation("module_created", &module.id).await?;
    services.cache.delete_all("modules:*").await?;
    services.cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Created().json(module))
}

#[put("/modules/{id}")]
pub async fn update_module(
    path: web::Path<String>,
    req: web::Json<UpdateModuleRequest>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let module_id = path.into_inner();
    
    let mut query = "MATCH (m:Module {id: $module_id}) SET ".to_string();
    let mut updates = Vec::new();
    
    if let Some(title) = &req.title {
        updates.push(format!("m.title = '{}'", title));
    }
    if let Some(order) = req.order {
        updates.push(format!("m.order = {}", order));
    }
    if let Some(duration) = req.module_duration_minutes {
        updates.push(format!("m.module_duration_minutes = {}", duration));
    }
    
    if updates.is_empty() {
        return Err(ApiError::Internal("No fields to update".to_string()));
    }
    
    query.push_str(&updates.join(", "));
    query.push_str(" RETURN m");
    
    let updated_modules: Vec<Module> = services.neo4j
        .query_nodes(&query)
        .param("module_id", module_id.clone())
        .fetch_key("m")
        .fetch()
        .await?;
    
    if updated_modules.is_empty() {
        return Err(ApiError::NotFound("Module not found".to_string()));
    }
    
    if let Some(lesson_ids) = &req.lesson_ids {
        services.neo4j
            .query_nodes("MATCH (m:Module {id: $module_id})-[r:HAS_LESSON]->() DELETE r")
            .param("module_id", module_id.clone())
            .fetch::<Module>()
            .await?;
        
        for lesson_id in lesson_ids {
            let _ = services.neo4j.create_relationship(
                &module_id,
                lesson_id,
                "Module",
                "Lesson",
                "HAS_LESSON",
                None
            ).await;
        }
    }
    

    services.kafka.publish_cache_invalidation("module_updated", &module_id).await?;
    services.cache.delete_all("modules:*").await?;
    services.cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Ok().json(updated_modules.get(0)))
}

#[delete("/modules/{id}")]
pub async fn delete_module(
    path: web::Path<String>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    let module_id = path.into_inner();
    
    services.neo4j
        .query_nodes(
            "MATCH (m:Module {id: $module_id})
             DETACH DELETE m"
        )
        .param("module_id", module_id.clone())
        .fetch::<Module>()
        .await?;
    
    services.kafka.publish_cache_invalidation("module_deleted", &module_id).await?;
    services.cache.delete_all("modules:*").await?;
    services.cache.delete_all("programs:*").await?;
    
    Ok(HttpResponse::Ok().json(serde_json::json!({
        "message": "Module deleted and cache invalidated"
    })))
}
