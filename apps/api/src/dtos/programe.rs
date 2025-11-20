use serde::{Deserialize, Serialize};
use neo4rs::{BoltList, BoltMap, BoltType, Error, Node, Row};
use crate::{error::ApiError, models::programe::{Course, Lesson, Module}, traits::from_node::FromNode};


#[derive(Serialize, Deserialize, Debug)]
pub struct ProgramDetail {
    pub course: Course,
    pub modules: Vec<ModuleWithLessons>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ModuleWithLessons {
    pub module: Module,
    pub lessons: Vec<Lesson>,
}

#[derive(Serialize, Deserialize, Debug, sqlx::FromRow, Default)]
pub struct CourseStats {
    pub lesson_count: i64,
    pub total_duration: i64,
}

#[derive(Serialize, Deserialize)]
pub struct CreateCourseRequest {
    pub title: String,
    pub description: String,
    pub category: String,
    pub level: String,
    pub rating: f32,
    pub instructor: String,
    pub featured: bool,
    pub status: String,
    pub cover: String,
    pub module_ids: Vec<String>,
    pub prerequisites: Vec<String>,
    pub documents: Vec<String>,
    pub total_duration_minitues: String
}

#[derive(Serialize, Deserialize)]
pub struct UpdateCourseRequest {
    pub title: Option<String>,
    pub description: Option<String>,
    pub status: Option<String>,
    pub cover: Option<String>,
    pub module_ids: Option<Vec<String>>,
    pub prerequisites: Option<Vec<String>>,
    pub documents: Option<Vec<String>>,
    pub total_duration_minitues: Option<String>
}


impl FromNode for ProgramDetail {
    fn from_node(node: &neo4rs::Node) -> Result<Self, ApiError> {
        let course_node: neo4rs::Node = node
            .get("course")
            .map_err(|_| ApiError::Neo4j(Error::ConversionError))?;
        let course = Course::from_node(&course_node)?;

        let modules_nodes: Vec<neo4rs::Node> = node
            .get("modules")
            .map_err(|_| ApiError::Neo4j(Error::ConversionError))?;

        let mut modules_with_lessons = Vec::new();

        for module_node in modules_nodes {
            let module_info: neo4rs::Node = module_node
                .get("module")
                .map_err(|_| ApiError::Neo4j(Error::ConversionError))?;

            let module = Module::from_node(&module_info)?;
            let module_order = module.order;

            let module_lessons_nodes: Vec<neo4rs::Node> = module_node
                .get("lessons")
                .map_err(|_| ApiError::Neo4j(Error::ConversionError))?;

            let lessons: Vec<Lesson> = module_lessons_nodes
                .iter()
                .map(|n| Lesson::from_node(n))
                .collect::<Result<Vec<_>, _>>()?
                .into_iter()
                .filter(|lesson| lesson.order == module_order)
                .collect();

            modules_with_lessons.push(ModuleWithLessons {
                module,
                lessons,
            });
        }

        Ok(Self {
            course,
            modules: modules_with_lessons,
        })
    }
}

impl FromNode for ModuleWithLessons {
    fn from_node(node: &neo4rs::Node) -> Result<Self, ApiError> {
        let module_node: neo4rs::Node = node.get("m")
            .map_err(|_| ApiError::Neo4j(Error::ConversionError))?;
        let module = Module::from_node(&module_node)?;

        let lessons_nodes: Vec<neo4rs::Node> = node.get("lessons")
            .map_err(|_| ApiError::Neo4j(Error::ConversionError))?;
        let lessons: Vec<Lesson> = lessons_nodes
            .iter()
            .map(|n| Lesson::from_node(n))
            .collect::<Result<_, _>>()?;

        Ok(Self {
            module,
            lessons,
        })
    }
}
