use sqlx::PgPool;

use crate::service::postgres_query::{PgDelete, PgInsert, PgQuery, PgUpdate};

pub struct PostgresService {
    pool: PgPool,
}

impl PostgresService {
    pub fn new(pool: PgPool)->Self{
        Self { pool: pool }
    }

    pub fn query<'a>(&'a self, sql: impl Into<String>) -> PgQuery<'a> {
        PgQuery {
            pool: &self.pool,
            sql: sql.into(),
            binds: vec![],
        }
    }

    pub fn insert<'a>(&'a self, table: &str) -> PgInsert<'a> {
        PgInsert {
            pool: &self.pool,
            table: table.to_string(),
            columns: vec![],
            values: vec![],
            returning: None,
        }
    }

    pub fn update<'a>(&'a self, table: &str) -> PgUpdate<'a> {
        PgUpdate {
            pool: &self.pool,
            table: table.to_string(),
            sets: vec![],
            wheres: vec![],
            returning: None,
        }
    }

    pub fn delete<'a>(&'a self, table: &str) -> PgDelete<'a> {
        PgDelete {
            pool: &self.pool,
            table: table.to_string(),
            wheres: vec![],
        }
    }
}



