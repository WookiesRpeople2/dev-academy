use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize)]
pub struct CreateLessonRequest {
    pub title: String,
    pub order: i32,
    pub duration_minutes: i32,
    pub prerequisites: Vec<String>,
    pub video: String,
}

#[derive(Serialize, Deserialize)]
pub struct UpdateLessonRequest {
    pub title: Option<String>,
    pub order: Option<i32>,
    pub duration_minutes: Option<i32>,
    pub prerequisites: Option<Vec<String>>,
    pub completed: Option<bool>,
    pub video: Option<String>,
}
