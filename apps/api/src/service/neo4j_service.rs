use neo4rs::{BoltType, Graph};
use std::{collections::HashMap, sync::Arc};

use crate::{error::ApiError, service::neo4j_query::{Neo4jCreate, Neo4jDelete, Neo4jQuery, Neo4jUpdate}};

pub struct Neo4jService {
    pub graph: Arc<Graph>,
}

impl Neo4jService {
    pub fn new(graph: Arc<Graph>) -> Self {
        Self { graph }
    }

    pub fn create_node(&self, label: &str) -> Neo4jCreate<'_> {
        Neo4jCreate {
            graph: &self.graph,
            label: label.to_string(),
            props: vec![],
        }
    }

    pub fn update_node(&self, label: &str) -> Neo4jUpdate<'_> {
        Neo4jUpdate {
            graph: &self.graph,
            label: label.to_string(),
            node_id: None,
            props: vec![],
        }
    }

    pub fn delete_node(&self, label: &str) -> Neo4jDelete<'_> {
        Neo4jDelete {
            graph: &self.graph,
            label: label.to_string(),
            node_id: None,
        }
    }

    pub fn query_nodes(&self, cypher: impl Into<String>) -> Neo4jQuery<'static> {
        Neo4jQuery {
            graph: self.graph.clone(),
            cypher: cypher.into(),
            params: HashMap::new(),
            key: None,
        }
    }


    pub async fn create_relationship(
        &self,
        from_id: &str,
        to_id: &str,
        from_label: &str,
        to_label: &str,
        rel_type: &str,
        props: Option<Vec<(&str, BoltType)>>,
    ) -> Result<(), ApiError> {
        let mut cypher = format!(
            "MATCH (a:{from_label} {{id: $from_id}})
            MATCH (b:{to_label} {{id: $to_id}})
            CREATE (a)-[r:{rel_type}]->(b)",
            from_label = from_label,
            to_label = to_label,
            rel_type = rel_type,
        );

        if let Some(ref p) = props {
            if !p.is_empty() {
                let set_clauses = p.iter()
                    .map(|(k, _)| format!("r.{k} = ${k}"))
                    .collect::<Vec<_>>()
                    .join(", ");
                cypher = format!("{cypher} SET {set_clauses}");
            }
        }

        cypher = format!("{cypher} RETURN r");

        let mut q = neo4rs::query(&cypher)
            .param("from_id", from_id)
            .param("to_id", to_id);

        if let Some(p) = props {
            for (k, v) in p {
                q = q.param(k, v);
            }
        }

        let _ = self.graph.run(q).await?;
        Ok(())
    }
}
