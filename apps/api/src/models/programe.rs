use serde::{Serialize, Deserialize};
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize)]
pub struct Courses {
    pub id: String,
    pub title: String,
    pub description: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Module {
    pub id: String,
    pub course_id: String,
    pub title: String,
    pub order: i32,
}

#[derive(Serialize, Deserialize)]
pub struct Lesson {
    pub id: String,
    pub module_id: String,
    pub title: String,
    pub order: i32,
    pub duration_minutes: i32,
}

impl Courses {
    pub fn new(title: &str, description: &str, status: &str) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            title: title.to_string(),
            description: description.to_string(),
            status: status.to_string(),
        }
    }
}

impl Module {
    pub fn new(course_id: &str, title: &str, order: i32) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            course_id: course_id.to_string(),
            title: title.to_string(),
            order,
        }
    }
}

impl Lesson {
    pub fn new(module_id: &str, title: &str, order: i32, duration_minutes: i32) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            module_id: module_id.to_string(),
            title: title.to_string(),
            order,
            duration_minutes,
        }
    }
}

