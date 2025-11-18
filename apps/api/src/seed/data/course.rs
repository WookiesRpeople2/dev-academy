use api::models::programe::{Course, Module, Lesson};
use uuid::Uuid;

#[derive(Debug)]
pub struct SeedLesson {
    pub title: &'static str,
    pub duration_minutes: i32,
    pub prerequisites: Vec<&'static str>,
    pub video: &'static str, 
}

#[derive(Debug)]
pub struct SeedModule {
    pub title: &'static str,
    pub lessons: Vec<SeedLesson>,
}

#[derive(Debug)]
pub struct SeedCourse {
    pub title: &'static str,
    pub description: &'static str,
    pub status: &'static str,
    pub cover: &'static str,
    pub prerequisites: Vec<&'static str>,
    pub documents: Vec<&'static str>, 
    pub modules: Vec<SeedModule>,
}

pub fn get_seed_courses() -> Vec<Course> {
    let seed_courses = vec![
        SeedCourse {
            title: "Rust Programming Fundamentals",
            description: "Master the fundamentals of Rust including ownership, borrowing, and lifetimes",
            status: "active",
            cover: "images/rust-fundamentals.jpeg",
            prerequisites: vec![],
            documents: vec![
                "courses/rust-fundamentals/rust-book.pdf",
                "courses/rust-fundamentals/cheatsheet.pdf",
                "documents/rust-fundamentals/intro/what-is-rust-slides.pdf",
                "documents/rust-fundamentals/ownership/ownership-rules.pdf",
                "documents/rust-fundamentals/ownership/borrowing-guide.pdf",
            ],
            modules: vec![
                SeedModule {
                    title: "Introduction to Rust",
                    lessons: vec![
                        SeedLesson { 
                            title: "What is Rust?", 
                            duration_minutes: 10, 
                            prerequisites: vec![],
                            video: "videos/rust-fundamentals/intro/what-is-rust.mp4",
                        },
                        SeedLesson { 
                            title: "Installing Rust", 
                            duration_minutes: 15, 
                            prerequisites: vec![],
                            video: "videos/rust-fundamentals/intro/installing-rust.mp4",
                        },
                    ],
                },
                SeedModule {
                    title: "Ownership and Borrowing",
                    lessons: vec![
                        SeedLesson { 
                            title: "Ownership Basics", 
                            duration_minutes: 20, 
                            prerequisites: vec!["What is Rust?"],
                            video: "videos/rust-fundamentals/ownership/ownership-basics.mp4",
                        },
                        SeedLesson { 
                            title: "Borrowing & References", 
                            duration_minutes: 25, 
                            prerequisites: vec!["Ownership Basics"],
                            video: "videos/rust-fundamentals/ownership/borrowing-references.mp4",
                        },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Web Development with Actix",
            description: "Build production-ready web applications using Actix-web framework",
            status: "active",
            cover: "images/actix-web.jpeg",
            prerequisites: vec!["Rust Programming Fundamentals"],
            documents: vec![
                "courses/actix-web/actix-documentation.pdf",
                "courses/actix-web/rest-api-design.pdf",
                "documents/actix-web/basics/project-setup.pdf",
                "documents/actix-web/apis/serde-guide.pdf",
            ],
            modules: vec![
                SeedModule {
                    title: "Actix Basics",
                    lessons: vec![
                        SeedLesson { 
                            title: "Setting up Actix", 
                            duration_minutes: 15, 
                            prerequisites: vec![],
                            video: "videos/actix-web/basics/setup-actix.mp4",
                        },
                        SeedLesson { 
                            title: "Routing and Handlers", 
                            duration_minutes: 20, 
                            prerequisites: vec!["Setting up Actix"],
                            video: "videos/actix-web/basics/routing-handlers.mp4",
                        },
                    ],
                },
                SeedModule {
                    title: "Building APIs",
                    lessons: vec![
                        SeedLesson { 
                            title: "REST Endpoints", 
                            duration_minutes: 25, 
                            prerequisites: vec![],
                            video: "videos/actix-web/apis/rest-endpoints.mp4",
                        },
                        SeedLesson { 
                            title: "JSON Serialization", 
                            duration_minutes: 20, 
                            prerequisites: vec!["REST Endpoints"],
                            video: "videos/actix-web/apis/json-serialization.mp4",
                        },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Async Rust Programming",
            description: "Deep dive into async/await, tokio runtime, and concurrent programming",
            status: "active",
            cover: "images/async-rust.jpeg",
            prerequisites: vec!["Rust Programming Fundamentals"],
            documents: vec![
                "courses/async-rust/async-book.pdf",
                "documents/async-rust/basics/futures-explained.pdf",
                "documents/async-rust/basics/tokio-runtime.pdf",
                "documents/async-rust/concurrency/task-management.pdf",
                "documents/async-rust/concurrency/channel-patterns.pdf",
            ],
            modules: vec![
                SeedModule {
                    title: "Async Basics",
                    lessons: vec![
                        SeedLesson { 
                            title: "Futures and async/await", 
                            duration_minutes: 20, 
                            prerequisites: vec![],
                            video: "videos/async-rust/basics/futures-async-await.mp4",
                        },
                        SeedLesson { 
                            title: "Using Tokio", 
                            duration_minutes: 25, 
                            prerequisites: vec!["Futures and async/await"],
                            video: "videos/async-rust/basics/using-tokio.mp4",
                        },
                    ],
                },
                SeedModule {
                    title: "Concurrency Patterns",
                    lessons: vec![
                        SeedLesson { 
                            title: "Tasks and Spawning", 
                            duration_minutes: 20, 
                            prerequisites: vec![],
                            video: "videos/async-rust/concurrency/tasks-spawning.mp4",
                        },
                        SeedLesson { 
                            title: "Channels and Sync", 
                            duration_minutes: 25, 
                            prerequisites: vec!["Tasks and Spawning"],
                            video: "videos/async-rust/concurrency/channels-sync.mp4",
                        },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Database Design with PostgreSQL",
            description: "Learn database modeling, indexing, and optimization techniques",
            status: "active",
            cover: "images/postgresql.jpeg",
            prerequisites: vec![],
            documents: vec![
                "courses/postgresql/postgres-guide.pdf",
                "documents/postgresql/modeling/er-diagram-guide.pdf",
                "documents/postgresql/modeling/normal-forms.pdf",
                "documents/postgresql/optimization/index-types.pdf",
                "documents/postgresql/optimization/query-optimization.pdf",
            ],
            modules: vec![
                SeedModule {
                    title: "Relational Modeling",
                    lessons: vec![
                        SeedLesson { 
                            title: "ER Diagrams", 
                            duration_minutes: 15, 
                            prerequisites: vec![],
                            video: "videos/postgresql/modeling/er-diagrams.mp4",
                        },
                        SeedLesson { 
                            title: "Normalization", 
                            duration_minutes: 20, 
                            prerequisites: vec!["ER Diagrams"],
                            video: "videos/postgresql/modeling/normalization.mp4",
                        },
                    ],
                },
                SeedModule {
                    title: "PostgreSQL Optimization",
                    lessons: vec![
                        SeedLesson { 
                            title: "Indexes", 
                            duration_minutes: 20, 
                            prerequisites: vec![],
                            video: "videos/postgresql/optimization/indexes.mp4",
                        },
                        SeedLesson { 
                            title: "Query Tuning", 
                            duration_minutes: 25, 
                            prerequisites: vec!["Indexes"],
                            video: "videos/postgresql/optimization/query-tuning.mp4",
                        },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Graph Databases with Neo4j",
            description: "Explore graph data modeling and Cypher query language",
            status: "active",
            cover: "images/neo4j.jpeg",
            prerequisites: vec![],
            documents: vec![
                "courses/neo4j/neo4j-handbook.pdf",
                "documents/neo4j/basics/graph-fundamentals.pdf",
                "documents/neo4j/basics/cypher-cheatsheet.pdf",
                "documents/neo4j/advanced/pattern-examples.pdf",
                "documents/neo4j/advanced/algorithm-guide.pdf",
            ],
            modules: vec![
                SeedModule {
                    title: "Graph Theory Basics",
                    lessons: vec![
                        SeedLesson { 
                            title: "Nodes and Relationships", 
                            duration_minutes: 15, 
                            prerequisites: vec![],
                            video: "videos/neo4j/basics/nodes-relationships.mp4",
                        },
                        SeedLesson { 
                            title: "Cypher Queries", 
                            duration_minutes: 20, 
                            prerequisites: vec!["Nodes and Relationships"],
                            video: "videos/neo4j/basics/cypher-queries.mp4",
                        },
                    ],
                },
                SeedModule {
                    title: "Advanced Graph Queries",
                    lessons: vec![
                        SeedLesson { 
                            title: "Pattern Matching", 
                            duration_minutes: 20, 
                            prerequisites: vec![],
                            video: "videos/neo4j/advanced/pattern-matching.mp4",
                        },
                        SeedLesson { 
                            title: "Graph Algorithms", 
                            duration_minutes: 25, 
                            prerequisites: vec!["Pattern Matching"],
                            video: "videos/neo4j/advanced/graph-algorithms.mp4",
                        },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Event-Driven Architecture with Kafka",
            description: "Design scalable systems using Apache Kafka and event sourcing patterns",
            status: "active",
            cover: "images/kafka.jpeg",
            prerequisites: vec![],
            documents: vec![
                "courses/kafka/kafka-definitive-guide.pdf",
                "documents/kafka/fundamentals/kafka-architecture.pdf",
                "documents/kafka/fundamentals/producer-consumer-guide.pdf",
                "documents/kafka/event-sourcing/patterns.pdf",
                "documents/kafka/event-sourcing/integration-guide.pdf",
            ],
            modules: vec![
                SeedModule {
                    title: "Kafka Fundamentals",
                    lessons: vec![
                        SeedLesson { 
                            title: "Topics and Partitions", 
                            duration_minutes: 15, 
                            prerequisites: vec![],
                            video: "videos/kafka/fundamentals/topics-partitions.mp4",
                        },
                        SeedLesson { 
                            title: "Producers and Consumers", 
                            duration_minutes: 20, 
                            prerequisites: vec!["Topics and Partitions"],
                            video: "videos/kafka/fundamentals/producers-consumers.mp4",
                        },
                    ],
                },
                SeedModule {
                    title: "Event Sourcing",
                    lessons: vec![
                        SeedLesson { 
                            title: "Design Patterns", 
                            duration_minutes: 25, 
                            prerequisites: vec![],
                            video: "videos/kafka/event-sourcing/design-patterns.mp4",
                        },
                        SeedLesson { 
                            title: "Integrating Kafka", 
                            duration_minutes: 20, 
                            prerequisites: vec!["Design Patterns"],
                            video: "videos/kafka/event-sourcing/integrating-kafka.mp4",
                        },
                    ],
                },
            ],
        },
    ];

    seed_courses.into_iter().map(|sc| {
        let modules: Vec<Module> = sc.modules.into_iter().enumerate().map(|(i, m)| {
            let lessons: Vec<Lesson> = m.lessons.into_iter().enumerate().map(|(j, l)| Lesson {
                id: Uuid::new_v4().to_string(),
                title: l.title.to_string(),
                order: j as i32 + 1,
                duration_minutes: l.duration_minutes,
                prerequisites: l.prerequisites.into_iter().map(|s| s.to_string()).collect(),
                completed: false,
                video: l.video.to_string(),
            }).collect();

            let module_duration_minutes = lessons.iter().map(|l| l.duration_minutes).sum();

            Module {
                id: Uuid::new_v4().to_string(),
                title: m.title.to_string(),
                order: i as i32 + 1,
                lessons,
                module_duration_minutes,
            }
        }).collect();

        let total_duration_minutes = modules.iter().map(|m| m.module_duration_minutes).sum();

        Course {
            id: Uuid::new_v4().to_string(),
            title: sc.title.to_string(),
            description: sc.description.to_string(),
            status: sc.status.to_string(),
            cover: sc.cover.to_string(),
            prerequisites: sc.prerequisites.into_iter().map(|s| s.to_string()).collect(),
            documents: sc.documents.into_iter().map(|s| s.to_string()).collect(),
            modules,
            total_duration_minutes,
        }
    }).collect()
}

