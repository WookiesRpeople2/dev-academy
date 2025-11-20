use api::config::Config;
use api::models::programe::{Course, Module, Lesson};
use api::service::neo4j_service::Neo4jService;
use api::service::kafka_service::KafkaService;
use api::service::opensearch::OpenSearchService;
use api::service::redis_cache_service::CacheService;
use anyhow::Result;
use api::traits::redis_trait::RedisCache;

use crate::data::course::get_seed_courses;

pub async fn seed_database(config: &Config) -> Result<()> {
    println!("Initializing services...");
    let neo4j = Neo4jService::new(config.neo4j.clone());
    let kafka = KafkaService::new(config.kafka_producer.clone());
    let cache = CacheService::new(config.redis.clone());
    let opensearch = OpenSearchService::new(config.opensearch.clone());

    println!("Clearing existing cache...");
    cache.delete_all("programs:*").await?;

    let courses = get_seed_courses();
    println!("Seeding {} courses...", courses.len());

    for (index, course) in courses.iter().enumerate() {
        println!("[{}/{}] Creating course: {}", index + 1, courses.len(), course.title);

        let neo_course: Course = neo4j
            .create_node("Course")
            .prop("title", course.title)
            .prop("description", course.description)
            .prop("cover", course.cover)
            .prop("status", course.status)
            .prop("category", course.category)
            .prop("level", course.level)
            .prop("rating", course.rating.clone())
            .prop("instructor", course.instructor)
            .prop("featured", *course.featured)
            .prop("documents", course.documents.clone())
            .prop("total_duration_minutes", course.total_duration_minutes)
            .exec()
            .await?;

        kafka
            .publish_cache_invalidation("course_created", &neo_course.id.to_string())
            .await?;

       let _ = opensearch.index_course(&neo_course).await; 

        for (_mod_index, module) in course.modules.iter().enumerate() {
            println!("  Creating module: {}", module.title);
            let neo_module: Module = neo4j
                .create_node("Module")
                .prop("title", module.title)
                .prop("order", module.order)
                .prop("module_duration_minutes", module.module_duration_minutes)
                .exec()
                .await?;

            let course_id_str = neo_course.id.to_string();
            let module_id_str = neo_module.id.to_string();

            neo4j.create_relationship(
                &course_id_str,
                &module_id_str,
                "Course",
                "Module",
                "HAS_MODULE",
                None,
            ).await?;

            for lesson in &module.lessons {
                let neo_lesson: Lesson = neo4j
                    .create_node("Lesson")
                    .prop("title", lesson.title)
                    .prop("order", lesson.order)
                    .prop("duration_minutes", lesson.duration_minutes)
                    .prop("prerequisites", lesson.prerequisites.clone())
                    .prop("completed", *lesson.completed)
                    .prop("video", lesson.video)
                    .exec()
                    .await?;

                let lesson_id_str = neo_lesson.id.to_string();

                neo4j.create_relationship(
                    &module_id_str,
                    &lesson_id_str,
                    "Module",
                    "Lesson",
                    "HAS_LESSON",
                    None,
                ).await?;
            }
        }

        println!(
            "  ✓ Successfully seeded: {} (Status: {})",
            neo_course.title, neo_course.status
        );

        cache
            .set(
                &format!("programs:course:{}", neo_course.id),
                &neo_course,
                3600,
            )
            .await?;
    }

    println!("\n✓ Database seeding completed successfully.");
    println!("  Total courses seeded: {}", courses.len());

    Ok(())
}
