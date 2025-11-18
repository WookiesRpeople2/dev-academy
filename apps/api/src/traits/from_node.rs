use neo4rs::Node;
use crate::error::ApiError;

pub trait FromNode: Sized {
    fn from_node(node: &Node) -> Result<Self, ApiError>;
}
