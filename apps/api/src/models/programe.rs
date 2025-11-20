use neo4rs::Error;
use serde::{Serialize, Deserialize};

use crate::{error::ApiError, traits::from_node::FromNode};

#[derive(Debug, Deserialize, Serialize)]
pub struct Course {
    pub id: String,
    pub title: String,
    pub description: String,
    pub status: String,
    pub category: String,
    pub level: String,
    pub rating: f32,
    pub instructor: String,
    pub featured: bool,
    pub cover: String,
    pub prerequisites: Vec<String>,
    pub documents: Vec<String>,
    pub total_duration_minutes: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Module {
    pub id: String,
    pub title: String,
    pub order: i32,
    pub module_duration_minutes: i32, 
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Lesson {
    pub id: String,
    pub title: String,
    pub order: i32,
    pub duration_minutes: i32,
    pub prerequisites: Vec<String>,
    pub completed: bool,
    pub video: String
}



impl FromNode for Course {
    fn from_node(node: &neo4rs::Node) -> Result<Self, ApiError> {
        Ok(Self {
            id: node.get("id").map_err(|_| ApiError::Internal("missing course id".to_string()))?,
            title: node.get("title").unwrap_or_default(),
            description: node.get("description").unwrap_or_default(),
            status: node.get("status").unwrap_or("draft".to_string()),
            category: node.get("category").map_err(|_| ApiError::Internal("missing category".to_string()))?,
            level: node.get("level").unwrap_or("beginner".to_string()),
            rating: node.get("rating").unwrap_or(0.0),
            instructor: node.get("instructor").map_err(|_| ApiError::Internal("missing category".to_string()))?,
            featured: node.get("featured").unwrap_or(false),
            cover: node.get("cover").unwrap_or_default(),
            prerequisites: match node.get::<Vec<String>>("prerequisites") {
                Ok(pre) => pre,
                Err(_) => vec![], 
            },
            documents: match node.get::<Vec<String>>("documents") {
                Ok(docs) => docs,
                Err(_) => vec![], 
            },
            total_duration_minutes: 0,
        })
    }
}

impl FromNode for Module {
    fn from_node(node: &neo4rs::Node) -> Result<Self, ApiError> {
        Ok(Self {
            id: node.get::<String>("id").map_err(|_| ApiError::Neo4j(Error::ConversionError))?,
            title: node.get("title").unwrap_or_default(),
            order: node
                .get::<String>("order")
                .map_err(|_| ApiError::Neo4j(Error::ConversionError))?
                .parse::<i32>()
                .map_err(|_| ApiError::Neo4j(Error::ConversionError))?,
            module_duration_minutes: 0,
        })
    }
}

impl FromNode for Lesson {
    fn from_node(node: &neo4rs::Node) -> Result<Self, ApiError> {
        Ok(Self {
            id: node.get::<String>("id").map_err(|_| ApiError::Neo4j(Error::ConversionError))?,
            title: node.get("title").unwrap_or_default(),
            order: node
                .get::<String>("order")
                .map_err(|_| ApiError::Neo4j(Error::ConversionError))?
                .parse::<i32>()
                .map_err(|_| ApiError::Neo4j(Error::ConversionError))?,
            duration_minutes: node.get("duration_minutes").unwrap_or(0),
            prerequisites: match node.get::<Vec<String>>("prerequisites") {
                Ok(pre) => pre,
                Err(_) => vec![], 
            },
            completed: node.get("completed").unwrap_or(false),
            video: node.get::<String>("video").map_err(|_| ApiError::Neo4j(Error::ConversionError))?
        })
    }
}

