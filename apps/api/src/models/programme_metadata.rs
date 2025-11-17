use serde::{Serialize, Deserialize};
use chrono::{NaiveDateTime, Utc};

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug)]
pub struct CourseMetadata {
    pub id: i32,
    pub title: String,
    pub description: String,
    pub status: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug)]
pub struct LessonMetadata {
    pub id: i32,
    pub course_id: i32,
    pub title: String,
    pub duration_minutes: i32,
    pub order: i32,
}

impl CourseMetadata {
    pub fn new(title: &str, description: &str, status: &str) -> Self {
        let now = Utc::now().naive_utc();
        Self {
            id: 0,
            title: title.to_string(),
            description: description.to_string(),
            status: status.to_string(),
            created_at: now,
            updated_at: now,
        }
    }
}

impl LessonMetadata {
    pub fn new(course_id: i32, title: &str, duration_minutes: i32, order: i32) -> Self {
        Self {
            id: 0,
            course_id,
            title: title.to_string(),
            duration_minutes,
            order,
        }
    }
}


