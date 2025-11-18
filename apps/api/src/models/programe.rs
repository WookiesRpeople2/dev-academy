use neo4rs::Error;
use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::{error::ApiError, traits::from_node::FromNode};

#[derive(Debug, Deserialize, Serialize)]
pub struct Course {
    pub id: String,
    pub title: String,
    pub description: String,
    pub status: String,
    pub cover: String,
    pub modules: Vec<Module>,
    pub prerequisites: Vec<String>,
    pub documents: Vec<String>,
    pub total_duration_minutes: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Module {
    pub id: String,
    pub title: String,
    pub order: i32,
    pub lessons: Vec<Lesson>,
    pub module_duration_minutes: i32, 
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Lesson {
    pub id: String,
    pub title: String,
    pub order: i32,
    pub duration_minutes: i32,
    pub prerequisites: Vec<String>,
    pub completed: bool,
    pub video: String
}


impl Course {
    pub fn new() -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            title: String::new(),
            description: String::new(),
            status: "draft".to_string(),
            cover: String::new(),
            modules: vec![],
            prerequisites: vec![],
            documents: vec![],
            total_duration_minutes: 0,
        }
    }
}

impl Module {
    pub fn new() -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            title: String::new(),
            order: 0,
            lessons: vec![],
            module_duration_minutes: 0,
        }
    }
}

impl Lesson {
    pub fn new() -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            title: String::new(),
            order: 0,
            duration_minutes: 0,
            prerequisites: vec![],
            completed: false,
            video: String::new()
        }
    }
}


impl FromNode for Course {
    fn from_node(node: &neo4rs::Node) -> Result<Self, ApiError> {
        Ok(Self {
            id: node.get("id").map_err(|_| ApiError::Internal("missing course id".to_string()))?,
            title: node.get("title").unwrap_or_default(),
            description: node.get("description").unwrap_or_default(),
            status: node.get("status").unwrap_or("draft".to_string()),
            cover: node.get("cover").unwrap_or_default(),
            modules: vec![],
            prerequisites: vec![],
            documents: vec![],
            total_duration_minutes: 0,
        })
    }
}

impl FromNode for Module {
    fn from_node(node: &neo4rs::Node) -> Result<Self, ApiError> {
        Ok(Self {
            id: node.get::<String>("id").map_err(|_| ApiError::Neo4j(Error::ConversionError))?,
            title: node.get("title").unwrap_or_default(),
            order: node.get("order").unwrap_or(0),
            lessons: vec![],
            module_duration_minutes: 0,
        })
    }
}

impl FromNode for Lesson {
    fn from_node(node: &neo4rs::Node) -> Result<Self, ApiError> {
        Ok(Self {
            id: node.get::<String>("id").map_err(|_| ApiError::Neo4j(Error::ConversionError))?,
            title: node.get("title").unwrap_or_default(),
            order: node.get("order").unwrap_or(0),
            duration_minutes: node.get("duration_minutes").unwrap_or(0),
            prerequisites: vec![],
            completed: node.get("completed").unwrap_or(false),
            video: node.get::<String>("id").map_err(|_| ApiError::Neo4j(Error::ConversionError))?
        })
    }
}

