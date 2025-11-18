use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct CreateModuleRequest {
    pub title: String,
    pub order: i32,
    pub lesson_ids: Vec<String>,
    pub module_duration_minutes: i32,
}

#[derive(Serialize, Deserialize)]
pub struct UpdateModuleRequest {
    pub title: Option<String>,
    pub order: Option<i32>,
    pub lesson_ids: Option<Vec<String>>,
    pub module_duration_minutes: Option<i32>,
}
