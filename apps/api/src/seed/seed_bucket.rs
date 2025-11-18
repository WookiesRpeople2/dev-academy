use anyhow::Result;
use crate::data::course::get_seed_courses;
use api::config::Config;
use api::service::s3_service::S3Service;

fn strip_prefix<'a>(path: &'a str, prefix: &str) -> &'a str {
    path.strip_prefix(prefix)
        .unwrap_or(path)
        .trim_start_matches('/')
}

pub async fn seed_bucket(config: &Config) -> Result<()> {
    println!("Initializing S3 service...");

    let s3_service = S3Service::new(config.s3_client.clone());

    for bucket in ["courses", "documents", "videos", "images"] {
        let _ = s3_service.create_bucket(bucket).await;
    }

    let courses = get_seed_courses();

    println!("getting sample document...");
    const SAMPLE_PDF: &[u8] = include_bytes!("../../assets/pdf-sample_0.pdf");
    const SAMPLE_VIDEO: &[u8] = include_bytes!("../../assets/file_example_MP4_1920_18MG.mp4");
    let rust_fundamentals = include_bytes!("../../assets/rust_programming_crab_sea.jpeg");
    let actix_web = include_bytes!("../../assets/681cecc3-5d26-49dc-bd92-6de921263994.jpeg");
    let async_rust = include_bytes!("../../assets/k_MRL0PDL.jpeg");
    let postgres = include_bytes!("../../assets/postgreSQL-couv100_50.jpeg");
    let neo4j = include_bytes!("../../assets/317yV01jXsL.jpeg");
    let kafka = include_bytes!("../../assets/ApacheKafka-960x540-1.jpeg");
    let pdf_bytes = SAMPLE_PDF.to_vec();
    let video_bytes = SAMPLE_VIDEO.to_vec();
    let images = [rust_fundamentals.to_vec(), actix_web.to_vec(), async_rust.to_vec(), postgres.to_vec(), neo4j.to_vec(), kafka.to_vec()];

    println!("Uploading course documents...");

    for course in &courses {
        for document_path in &course.documents {
            println!(" → Document: {}", document_path);

            let (bucket, key) = if document_path.starts_with("courses/") {
                ("courses", strip_prefix(document_path, "courses/"))
            } else {
                ("documents", strip_prefix(document_path, "documents/"))
            };

            let _ = s3_service
                .upload_data(bucket, key, pdf_bytes.clone())
                .await;

            println!("   ✔ Uploaded to {}/{}", bucket, key);
        }
        println!("Uploading cover images...");
        for image_bytes in &images{
            let path = strip_prefix(&course.cover, "images/");
            let _ = s3_service
                .upload_data("images", path, image_bytes.clone())
                .await;
        }
    }


    println!("Uploading course videos...");

    for course in &courses {
        for module in &course.modules {
            for lesson in &module.lessons {
                let raw_video_path = lesson.video.as_str();
                let key = strip_prefix(raw_video_path, "videos/");

                println!(" → Video: {}", raw_video_path);

                let _ = s3_service
                    .upload_data("videos", key, video_bytes.clone())
                    .await;

                println!("   ✔ Uploaded to videos/{}", key);
            }
        }
    }

    println!("All course documents and videos uploaded successfully.");
    Ok(())
}

