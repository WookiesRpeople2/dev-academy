use std::sync::Arc;
use opensearch::{
    DeleteParts, IndexParts, OpenSearch, SearchParts 
};
use serde::de::DeserializeOwned;
use serde_json::{json, Value};
use crate::{error::ApiError, models::{programe::{Course}, search::{FilterCondition, SearchResponse}}};

pub struct OpenSearchService {
    client: Arc<OpenSearch>,
}

impl OpenSearchService {
    pub fn new(client: Arc<OpenSearch>) -> Self {
        Self { client }
    }

    pub async fn search<T>(
        &self,
        index: &str,
        query_text: &str,
        fields: Vec<&str>,
        from: i64,
        size: i64,
    ) -> Result<SearchResponse<T>, ApiError>
    where
        T: DeserializeOwned + Send + Sync,
    {
        let query = json!({
            "query": {
                "multi_match": {
                    "query": query_text,
                    "fields": fields,
                    "type": "best_fields",
                    "operator": "or",
                    "fuzziness": "AUTO"
                }
            },
            "from": from,
            "size": size,
            "sort": ["_score"]
        });

        let response = self.client
            .search(SearchParts::Index(&[index]))
            .body(query)
            .send()
            .await
            .map_err(|e| ApiError::Internal(format!("OpenSearch request failed: {}", e)))?;

        let json = response
            .json::<Value>()
            .await
            .map_err(|e| ApiError::Internal(format!("Failed to parse response: {}", e)))?;

        self.parse_search_response(json)
    }

    pub async fn filter<T>(
        &self,
        index: &str,
        filters: Vec<FilterCondition>,
        from: i64,
        size: i64,
        sort_by: Option<&str>,
        sort_order: Option<&str>,
    ) -> Result<SearchResponse<T>, ApiError>
    where
        T: DeserializeOwned + Send + Sync,
    {
        let mut bool_query = json!({
            "bool": {
                "must": []
            }
        });

        let must_array = bool_query["bool"]["must"].as_array_mut().unwrap();

        for filter in filters {
            match filter {
                FilterCondition::Term { field, value } => {
                    must_array.push(json!({
                        "term": {
                            field: value
                        }
                    }));
                }
                FilterCondition::Range { field, gte, lte, gt, lt } => {
                    let mut range_obj = json!({});
                    if let Some(v) = gte {
                        range_obj[field.clone()]["gte"] = json!(v);
                    }
                    if let Some(v) = lte {
                        range_obj[field.clone()]["lte"] = json!(v);
                    }
                    if let Some(v) = gt {
                        range_obj[field.clone()]["gt"] = json!(v);
                    }
                    if let Some(v) = lt {
                        range_obj[field.clone()]["lt"] = json!(v);
                    }
                    must_array.push(json!({
                        "range": range_obj
                    }));
                }
                FilterCondition::Match { field, value } => {
                    must_array.push(json!({
                        "match": {
                            field: value
                        }
                    }));
                }
                FilterCondition::Terms { field, values } => {
                    must_array.push(json!({
                        "terms": {
                            field: values
                        }
                    }));
                }
            }
        }

        let mut query_body = json!({
            "query": bool_query,
            "from": from,
            "size": size
        });

        if let Some(field) = sort_by {
            let order = sort_order.unwrap_or("asc");
            query_body["sort"] = json!([
                { field: { "order": order } }
            ]);
        }

        let response = self.client
            .search(SearchParts::Index(&[index]))
            .body(query_body)
            .send()
            .await
            .map_err(|e| ApiError::Internal(format!("OpenSearch request failed: {}", e)))?;

        let json = response
            .json::<Value>()
            .await
            .map_err(|e| ApiError::Internal(format!("Failed to parse response: {}", e)))?;

        self.parse_search_response(json)
    }

    fn parse_search_response<T>(&self, json: Value) -> Result<SearchResponse<T>, ApiError>
    where
        T: DeserializeOwned,
    {
        if let Some(error) = json.get("error") {
            return Err(ApiError::Internal(format!(
                "OpenSearch error: {}",
                serde_json::to_string(error).unwrap_or_else(|_| "Unknown error".to_string())
            )));
        }

        if json.get("hits").is_none() {
            return Err(ApiError::Internal(format!(
                "OpenSearch response missing 'hits' field. Response: {}",
                serde_json::to_string(&json).unwrap_or_else(|_| "Unable to serialize".to_string())
            )));
        }

        let total = json["hits"]["total"]["value"]
            .as_i64()
            .unwrap_or(0);

        let hits = json["hits"]["hits"]
            .as_array()
            .ok_or_else(|| {
                ApiError::Internal(format!(
                    "Invalid response format: 'hits.hits' is not an array. Response: {}",
                    serde_json::to_string(&json).unwrap_or_else(|_| "Unable to serialize".to_string())
                ))
            })?;

        let results: Result<Vec<T>, _> = hits
            .iter()
            .map(|hit| {
                serde_json::from_value(hit["_source"].clone())
                    .map_err(|e| ApiError::Internal(format!("Failed to deserialize hit: {}", e)))
            })
            .collect();

        Ok(SearchResponse {
            total,
            results: results?,
        })
    }

    pub async fn index_course(&self, course: &Course) -> Result<(), ApiError> {
        if !self.index_exists("programs").await? {
            self.create_programs_index().await?;
        }

        let body = json!({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "status": course.status,
            "cover": course.cover,
            "prerequisites": course.prerequisites,
            "documents": course.documents,
            "total_duration_minutes": course.total_duration_minutes,
        });

        self.client
            .index(IndexParts::IndexId("programs", &course.id))
            .body(body)
            .send()
            .await
            .map_err(|e| ApiError::Internal(format!("Failed to index course: {}", e)))?;

        Ok(())
    }

    pub async fn delete_course(&self, course_id: &str) -> Result<(), ApiError> {
        self.client
            .delete(DeleteParts::IndexId("programs", course_id))
            .send()
            .await
            .map_err(|e| ApiError::Internal(format!("Failed to delete course from index: {}", e)))?;

        Ok(())
    }

    pub async fn create_programs_index(&self) -> Result<(), ApiError> {
        let body = json!({
            "settings": {
                "number_of_shards": 1,
                "number_of_replicas": 0,
                "analysis": {
                    "analyzer": {
                        "default": {
                            "type": "standard"
                        }
                    }
                }
            },
            "mappings": {
                "properties": {
                    "id": { "type": "keyword" },
                    "title": {
                        "type": "text",
                        "fields": {
                            "keyword": { "type": "keyword" }
                        }
                    },
                    "description": { "type": "text" },
                    "status": { "type": "keyword" },
                    "cover": { "type": "keyword" },
                    "prerequisites": { "type": "keyword" },
                    "documents": { "type": "keyword" },
                    "total_duration_minutes": { "type": "integer" },
                }
            }
        });

        self.client
            .indices()
            .create(opensearch::indices::IndicesCreateParts::Index("programs"))
            .body(body)
            .send()
            .await
            .map_err(|e| ApiError::Internal(format!("Failed to create programs index: {}", e)))?;

        Ok(())
    }


    pub async fn index_exists(&self, index: &str) -> Result<bool, ApiError> {
        let response = self.client
            .indices()
            .exists(opensearch::indices::IndicesExistsParts::Index(&[index]))
            .send()
            .await
            .map_err(|e| ApiError::Internal(format!("Failed to check index existence: {}", e)))?;

        Ok(response.status_code().is_success())
    }
}


