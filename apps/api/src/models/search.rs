use serde::Serialize;


#[derive(Debug)]
pub enum FilterCondition {
    Term { field: String, value: String },
    Range { field: String, gte: Option<i64>, lte: Option<i64>, gt: Option<i64>, lt: Option<i64> },
    Match { field: String, value: String },
    Terms { field: String, values: Vec<String> },
}

#[derive(Debug, Serialize)]
pub struct SearchResponse<T> {
    pub total: i64,
    pub results: Vec<T>,
}
