use serde::Serialize;
use serde_json::json;
use sqlx::PgPool;

use crate::{error::ApiError, traits::pg_model_trait::PgModel};

pub struct PgQuery<'a> {
    pub pool: &'a PgPool,
    pub sql: String,
    pub binds: Vec<sqlx::types::Json<serde_json::Value>>,
}

pub struct PgInsert<'a> {
    pub pool: &'a PgPool,
    pub table: String,
    pub columns: Vec<String>,
    pub values: Vec<serde_json::Value>,
    pub returning: Option<String>,
}

pub struct PgUpdate<'a> {
    pub pool: &'a PgPool,
    pub table: String,
    pub sets: Vec<(String, serde_json::Value)>,
    pub wheres: Vec<(String, serde_json::Value)>,
    pub returning: Option<String>,
}

pub struct PgDelete<'a> {
    pub pool: &'a PgPool,
    pub table: String,
    pub wheres: Vec<(String, serde_json::Value)>,
}

impl<'a> PgQuery<'a> {
    pub fn bind(mut self, value: impl serde::Serialize) -> Self {
        self.binds.push(sqlx::types::Json(serde_json::json!(value)));
        self
    }

    pub async fn fetch_all<T>(self) -> Result<Vec<T>, ApiError>
    where
        T: PgModel + Unpin,
    {
        let mut query = sqlx::query_as::<_, T>(&self.sql);

        for b in self.binds {
            query = query.bind(b.0);
        }

        Ok(query.fetch_all(self.pool).await?)
    }

    pub async fn fetch_one<T>(self) -> Result<T, ApiError>
    where
        T: PgModel + Unpin,
    {
        let mut query = sqlx::query_as::<_, T>(&self.sql);

        for b in self.binds {
            query = query.bind(b.0);
        }

        Ok(query.fetch_one(self.pool).await?)
    }

    pub async fn fetch_optional<T>(self) -> Result<Option<T>, ApiError>
    where
        T: PgModel + Unpin,
    {
        let mut query = sqlx::query_as::<_, T>(&self.sql);

        for b in self.binds {
            query = query.bind(b.0);
        }

        Ok(query.fetch_optional(self.pool).await?)
    }
}

impl<'a> PgInsert<'a> {
    pub fn value(mut self, column: &str, val: impl Serialize) -> Self {
        self.columns.push(column.to_string());
        self.values.push(json!(val));
        self
    }

    pub fn returning(mut self, expr: &str) -> Self {
        self.returning = Some(expr.to_string());
        self
    }

    fn build_sql(&self) -> String {
        let cols = self.columns.join(", ");
        let placeholders = (1..=self.values.len())
            .map(|i| format!("${}", i))
            .collect::<Vec<_>>()
            .join(", ");

        let mut sql = format!(
            "INSERT INTO {} ({}) VALUES ({})",
            self.table, cols, placeholders
        );

        if let Some(ret) = &self.returning {
            sql.push_str(&format!(" RETURNING {}", ret));
        }

        sql
    }

    pub async fn fetch_one<T>(self) -> Result<T, ApiError>
    where
        T: PgModel + Unpin,
    {
        let sql = self.build_sql();

        let mut query = sqlx::query_as::<_, T>(&sql);

        for v in self.values {
            query = query.bind(v);
        }

        Ok(query.fetch_one(self.pool).await?)
    }
}

impl<'a> PgUpdate<'a> {
    pub fn set(mut self, column: &str, value: impl Serialize) -> Self {
        self.sets.push((column.to_string(), json!(value)));
        self
    }

    pub fn where_eq(mut self, column: &str, value: impl Serialize) -> Self {
        self.wheres.push((column.to_string(), json!(value)));
        self
    }

    pub fn returning(mut self, expr: &str) -> Self {
        self.returning = Some(expr.to_string());
        self
    }

    fn build_sql(&self) -> String {
        let sets = self
            .sets
            .iter()
            .enumerate()
            .map(|(i, (col, _))| format!("{} = ${}", col, i + 1))
            .collect::<Vec<_>>()
            .join(", ");

        let where_start = self.sets.len();

        let wheres = self
            .wheres
            .iter()
            .enumerate()
            .map(|(i, (col, _))| format!("{} = ${}", col, where_start + i + 1))
            .collect::<Vec<_>>()
            .join(" AND ");

        let mut sql = format!("UPDATE {} SET {}", self.table, sets);

        if !wheres.is_empty() {
            sql.push_str(&format!(" WHERE {}", wheres));
        }

        if let Some(ret) = &self.returning {
            sql.push_str(&format!(" RETURNING {}", ret));
        }

        sql
    }

    pub async fn fetch_one<T>(self) -> Result<T, ApiError>
    where
        T: PgModel + Unpin,
    {
        let sql = self.build_sql();

        let mut query = sqlx::query_as::<_, T>(&sql);

        for (_, v) in self.sets {
            query = query.bind(v);
        }
        for (_, v) in self.wheres {
            query = query.bind(v);
        }

        Ok(query.fetch_one(self.pool).await?)
    }
}

impl<'a> PgDelete<'a> {
    pub fn where_eq(mut self, column: &str, value: impl Serialize) -> Self {
        self.wheres.push((column.to_string(), json!(value)));
        self
    }

    fn build_sql(&self) -> String {
        let wheres = self
            .wheres
            .iter()
            .enumerate()
            .map(|(i, (col, _))| format!("{} = ${}", col, i + 1))
            .collect::<Vec<_>>()
            .join(" AND ");

        if wheres.is_empty() {
            panic!("DELETE without WHERE is disallowed");
        }

        format!("DELETE FROM {} WHERE {}", self.table, wheres)
    }

    pub async fn exec(self) -> Result<(), ApiError> {
        let sql = self.build_sql();

        let mut query = sqlx::query(&sql);
        for (_, v) in self.wheres {
            query = query.bind(v);
        }

        query.execute(self.pool).await?;
        Ok(())
    }
}

