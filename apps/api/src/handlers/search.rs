use actix_web::web;
use actix_web::{post, HttpResponse};
use crate::dtos::search::{CourseSearchResult, FilterRequest, SearchRequest, SearchResultResponse};
use crate::models::programe::Course;
use crate::models::search::FilterCondition;
use crate::service::AppServices;
use crate::error::ApiError;
use crate::traits::redis_trait::RedisCache;

#[post("/programs/search")]
pub async fn search_programs(
    req: web::Json<SearchRequest>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    
    let cache_key = format!(
        "search:programs:{}:{}:{}",
        req.query,
        req.from,
        req.size
    );
    
    if let Some(cached_results) = services.cache.get::<SearchResultResponse<CourseSearchResult>>(&cache_key).await? {
        return Ok(HttpResponse::Ok().json(cached_results));
    }
    
    let fields: Vec<&str> = req.fields.iter().map(|s| s.as_str()).collect();
    
    let search_response = services.opensearch
        .search::<CourseSearchResult>(
            "programs",
            &req.query,
            fields,
            req.from,
            req.size,
        )
        .await?;
    
    let response = SearchResultResponse {
        total: search_response.total,
        results: search_response.results,
        from: req.from,
        size: req.size,
        source: "opensearch".to_string(),
    };
    
    services.cache.set(&cache_key, &response, 300).await?;
    
    Ok(HttpResponse::Ok().json(response))
}

#[post("/programs/filter")]
pub async fn filter_programs(
    req: web::Json<FilterRequest>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    
    let cache_key = format!(
        "filter:programs:{}:{}:{}:{}:{}",
        req.status.as_ref().unwrap_or(&"none".to_string()),
        req.min_duration.unwrap_or(0),
        req.max_duration.unwrap_or(0),
        req.from,
        req.size
    );
    
    if let Some(cached_results) = services.cache.get::<SearchResultResponse<CourseSearchResult>>(&cache_key).await? {
        return Ok(HttpResponse::Ok().json(cached_results));
    }
    
    let mut filters: Vec<FilterCondition> = Vec::new();
    
    if let Some(status) = &req.status {
        filters.push(FilterCondition::Term {
            field: "status".to_string(),
            value: status.clone(),
        });
    }
    
    if req.min_duration.is_some() || req.max_duration.is_some() {
        filters.push(FilterCondition::Range {
            field: "total_duration_minutes".to_string(),
            gte: req.min_duration,
            lte: req.max_duration,
            gt: None,
            lt: None,
        });
    }
    
    if let Some(prereqs) = &req.prerequisites {
        if !prereqs.is_empty() {
            filters.push(FilterCondition::Terms {
                field: "prerequisites".to_string(),
                values: prereqs.clone(),
            });
        }
    }
    
    if let Some(title) = &req.title_match {
        filters.push(FilterCondition::Match {
            field: "title".to_string(),
            value: title.clone(),
        });
    }
    
    let filter_response = services.opensearch
        .filter::<CourseSearchResult>(
            "programs",
            filters,
            req.from,
            req.size,
            req.sort_by.as_deref(),
            req.sort_order.as_deref(),
        )
        .await?;
    
    let response = SearchResultResponse {
        total: filter_response.total,
        results: filter_response.results,
        from: req.from,
        size: req.size,
        source: "opensearch".to_string(),
    };
    
    services.cache.set(&cache_key, &response, 300).await?;
    
    Ok(HttpResponse::Ok().json(response))
}

#[post("/programs/advanced-search")]
pub async fn advanced_search_programs(
    query_params: web::Query<SearchRequest>,
    filter_req: web::Json<FilterRequest>,
    services: web::Data<AppServices>,
) -> Result<HttpResponse, ApiError> {
    
    let cache_key = format!(
        "advanced:programs:{}:{}:{}",
        query_params.query,
        filter_req.status.as_ref().unwrap_or(&"none".to_string()),
        filter_req.from
    );
    
    if let Some(cached_results) = services.cache.get::<SearchResultResponse<CourseSearchResult>>(&cache_key).await? {
        return Ok(HttpResponse::Ok().json(cached_results));
    }
    
    let mut filters: Vec<FilterCondition> = Vec::new();
    
    if !query_params.query.is_empty() {
        filters.push(FilterCondition::Match {
            field: "title".to_string(),
            value: query_params.query.clone(),
        });
    }
    
    if let Some(status) = &filter_req.status {
        filters.push(FilterCondition::Term {
            field: "status".to_string(),
            value: status.clone(),
        });
    }
    
    if filter_req.min_duration.is_some() || filter_req.max_duration.is_some() {
        filters.push(FilterCondition::Range {
            field: "total_duration_minutes".to_string(),
            gte: filter_req.min_duration,
            lte: filter_req.max_duration,
            gt: None,
            lt: None,
        });
    }
    
    let filter_response = services.opensearch
        .filter::<Course>(
            "programs",
            filters,
            filter_req.from,
            filter_req.size,
            filter_req.sort_by.as_deref(),
            filter_req.sort_order.as_deref(),
        )
        .await?;
    
    let response = SearchResultResponse {
        total: filter_response.total,
        results: filter_response.results,
        from: filter_req.from,
        size: filter_req.size,
        source: "opensearch".to_string(),
    };
    
    services.cache.set(&cache_key, &response, 300).await?;
    
    Ok(HttpResponse::Ok().json(response))
}
