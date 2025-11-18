use std::sync::Arc;
use std::collections::HashMap;
use neo4rs::{query, BoltType, Graph, Node};
use uuid::Uuid;
use crate::{error::ApiError, traits::from_node::FromNode};

pub struct Neo4jQuery<'a> {
    pub graph: Arc<Graph>,
    pub cypher: String,
    pub params: HashMap<String, BoltType>,
    pub key: Option<&'a str>,
}

pub struct Neo4jCreate<'a> {
    pub graph: &'a Arc<Graph>,
    pub label: String,
    pub props: Vec<(String, BoltType)>,
}

pub struct Neo4jUpdate<'a> {
    pub graph: &'a Arc<Graph>,
    pub label: String,
    pub node_id: Option<String>,
    pub props: Vec<(String, BoltType)>,
}

pub struct Neo4jDelete<'a> {
    pub graph: &'a Arc<Graph>,
    pub label: String,
    pub node_id: Option<String>,
}

impl Neo4jQuery<'_> {
    pub fn param(mut self, key: &str, val: impl Into<BoltType>) -> Self {
        self.params.insert(key.to_string(), val.into());
        self
    }

    pub fn fetch_key(mut self, key: &'static str) -> Self {
        self.key = Some(key);
        self
    }

    pub async fn fetch<T: FromNode>(self) -> Result<Vec<T>, ApiError> {
        let key = self.key.ok_or_else(|| ApiError::Internal("No return key set".into()))?;

        let mut q = query(&self.cypher);
        for (k, v) in self.params {
            q = q.param(&k, v);
        }

        let mut result = self.graph.execute(q).await?;
        let mut out = Vec::new();

        while let Some(row) = result.next().await? {
            let node: Node = row
                .get(key)
                .map_err(|_| ApiError::Internal(format!("Could not find key {}", key)))?;
            out.push(T::from_node(&node)?);
        }

        Ok(out)
    }
}

impl<'a> Neo4jCreate<'a> {
    pub fn prop(mut self, key: &str, val: impl Into<BoltType>) -> Self {
        self.props.push((key.to_string(), val.into()));
        self
    }

    pub async fn exec<T: FromNode>(mut self) -> Result<T, ApiError> {
        if !self.props.iter().any(|(k, _)| k == "id") {
            let uuid = Uuid::new_v4().to_string();
            self.props.push(("id".to_string(), uuid.into()));
        }

        let props_str = self.props
            .iter()
            .map(|(k, _)| format!("n.{k} = ${k}"))
            .collect::<Vec<_>>()
            .join(", ");

        let cypher = format!("CREATE (n:{}) SET {} RETURN n, ID(n) AS id", self.label, props_str);

        let mut q = query(&cypher);
        for (k, v) in self.props {
            q = q.param(&k, v);
        }

        let mut result = self.graph.execute(q).await?;
        if let Some(row) = result.next().await? {
            let node: Node = row.get("n").map_err(|_| ApiError::Internal("Could not find row".to_string()))?;
            Ok(T::from_node(&node)?)
        } else {
            Err(ApiError::Internal("Failed to create node".into()))
        }
    }
}

impl<'a> Neo4jUpdate<'a> {
    pub fn node(mut self, id: &str) -> Self {
        self.node_id = Some(id.to_string());
        self
    }

    pub fn prop(mut self, key: &str, val: impl Into<BoltType>) -> Self {
        self.props.push((key.to_string(), val.into()));
        self
    }

    pub async fn exec<T: FromNode>(self) -> Result<T, ApiError> {
        let node_id = self.node_id
            .ok_or_else(|| ApiError::Internal("Node ID is required".into()))?;

        let set_str = self.props
            .iter()
            .map(|(k, _)| format!("n.{k} = ${k}"))
            .collect::<Vec<_>>()
            .join(", ");

        let cypher = format!(
            "MATCH (n:{}) WHERE n.id = $id SET {} RETURN n",
            self.label, set_str
        );

        let mut q = query(&cypher).param("id", node_id.clone());
        for (k, v) in self.props {
            q = q.param(&k, v);
        }

        let mut result = self.graph.execute(q).await?;
        if let Some(row) = result.next().await? {
            let node: Node = row.get("n").map_err(|_| ApiError::Internal("Could not find row".to_string()))?;
            Ok(T::from_node(&node)?)
        } else {
            Err(ApiError::NotFound(format!("Node {} not found", node_id)))
        }
    }
}

impl<'a> Neo4jDelete<'a> {
    pub fn node(mut self, id: &str) -> Self {
        self.node_id = Some(id.to_string());
        self
    }

    pub async fn exec(self) -> Result<(), ApiError> {
        let node_id = self.node_id
            .ok_or_else(|| ApiError::Internal("Node ID is required".into()))?;

        let cypher = format!("MATCH (n:{}) WHERE n.id = $id DETACH DELETE n", self.label);

        let _ = self.graph.execute(query(&cypher).param("id", node_id)).await?;
        Ok(())
    }
}

