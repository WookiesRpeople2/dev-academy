use sqlx::FromRow;

pub trait PgModel:
    Sized + Send + Sync + for<'r> FromRow<'r, sqlx::postgres::PgRow>
{}
impl<T> PgModel for T
where
    T: Sized + Send + Sync + for<'r> FromRow<'r, sqlx::postgres::PgRow>
{}
