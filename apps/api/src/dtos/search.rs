use serde::{Deserialize, Serialize};


#[derive(Debug, Deserialize)]
pub struct SearchRequest {
    pub query: String,
    #[serde(default = "default_fields")]
    pub fields: Vec<String>,
    #[serde(default)]
    pub from: i64,
    #[serde(default = "default_size")]
    pub size: i64,
}

fn default_fields() -> Vec<String> {
    vec![
        "title".to_string(),
        "description".to_string(),
        "prerequisites".to_string(),
    ]
}

fn default_size() -> i64 {
    10
}

#[derive(Debug, Deserialize)]
pub struct FilterRequest {
    #[serde(default)]
    pub status: Option<String>,
    #[serde(default)]
    pub min_duration: Option<i64>,
    #[serde(default)]
    pub max_duration: Option<i64>,
    #[serde(default)]
    pub prerequisites: Option<Vec<String>>,
    #[serde(default)]
    pub title_match: Option<String>,
    #[serde(default)]
    pub from: i64,
    #[serde(default = "default_size")]
    pub size: i64,
    #[serde(default)]
    pub sort_by: Option<String>,
    #[serde(default)]
    pub sort_order: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchResultResponse<T> {
    pub total: i64,
    pub results: Vec<T>,
    pub from: i64,
    pub size: i64,
    pub source: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CourseSearchResult {
    pub id: String,
    pub title: String,
    pub description: String,
    pub status: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cover: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prerequisites: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub documents: Option<Vec<String>>,
    pub total_duration_minutes: i32,
}
