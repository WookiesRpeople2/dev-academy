use aws_sdk_s3::primitives::ByteStream;
use std::path::Path;
use std::sync::Arc;

pub struct S3Service {
    client: Arc<aws_sdk_s3::Client>,
}

impl S3Service {
    pub fn new(client: Arc<aws_sdk_s3::Client>) -> Self {
        Self { client }
    }

    pub async fn create_bucket(&self, bucket_name: &str) -> Result<(), Box<dyn std::error::Error>> {

        let region = self.client.config().region().unwrap().as_ref();

        let req = self.client.create_bucket().bucket(bucket_name);

        match req.send().await {
            Ok(_) => println!("✓ Bucket '{}' created in region {}", bucket_name, region),
            Err(e) => {
                println!("⚠ Bucket '{}' creation result: {} (may already exist)", bucket_name, e);
            }
        }

        println!("Bucket '{}' created, region {}", bucket_name, region);
        Ok(())
    }

    pub async fn upload_file(
        &self,
        bucket_name: &str,
        key: &str,
        file_path: &Path,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let body = ByteStream::from_path(file_path).await?;

        self.client
            .put_object()
            .bucket(bucket_name)
            .key(key)
            .body(body)
            .send()
            .await?;

        println!("Uploaded {} to {}/{}", file_path.display(), bucket_name, key);
        Ok(())
    }

    pub async fn upload_data(
        &self,
        bucket_name: &str,
        key: &str,
        data: Vec<u8>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let body = ByteStream::from(data);

        self.client
            .put_object()
            .bucket(bucket_name)
            .key(key)
            .body(body)
            .send()
            .await?;

        println!("Uploaded data to {}/{}", bucket_name, key);
        Ok(())
    }

    pub async fn download_file(
        &self,
        bucket_name: &str,
        key: &str,
    ) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
        let resp = self.client
            .get_object()
            .bucket(bucket_name)
            .key(key)
            .send()
            .await?;

        let data = resp.body.collect().await?;
        Ok(data.into_bytes().to_vec())
    }

    pub async fn list_objects(
        &self,
        bucket_name: &str,
    ) -> Result<Vec<String>, Box<dyn std::error::Error>> {
        let resp = self.client
            .list_objects_v2()
            .bucket(bucket_name)
            .send()
            .await?;

        let keys = resp
            .contents()
            .iter()
            .filter_map(|obj| obj.key().map(|k| k.to_string()))
            .collect();

        Ok(keys)
    }

    pub async fn delete_object(
        &self,
        bucket_name: &str,
        key: &str,
    ) -> Result<(), Box<dyn std::error::Error>> {
        self.client
            .delete_object()
            .bucket(bucket_name)
            .key(key)
            .send()
            .await?;

        println!("Deleted {}/{}", bucket_name, key);
        Ok(())
    }

    pub async fn object_exists(
        &self,
        bucket_name: &str,
        key: &str,
    ) -> Result<bool, Box<dyn std::error::Error>> {
        match self.client
            .head_object()
            .bucket(bucket_name)
            .key(key)
            .send()
            .await
        {
            Ok(_) => Ok(true),
            Err(_) => Ok(false),
        }
    }
}
