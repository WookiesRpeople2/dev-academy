use api::models::programe::{Course};
use uuid::Uuid;

#[derive(Debug)]
pub struct SeedLesson {
    pub title: &'static str,
    pub duration_minutes: i32,
    pub prerequisites: Vec<&'static str>,
    pub video: &'static str,
    pub order: &'static str,
    pub completed: &'static bool,
}

#[derive(Debug)]
pub struct SeedModule {
    pub title: &'static str,
    pub order: &'static str,
    pub module_duration_minutes: &'static str,
    pub lessons: Vec<SeedLesson>,
}

#[derive(Debug)]
pub struct SeedCourse {
    pub title: &'static str,
    pub description: &'static str,
    pub status: &'static str,
    pub category: &'static str,
    pub level: &'static str,
    pub rating: &'static f32,
    pub cover: &'static str,
    pub prerequisites: Vec<&'static str>,
    pub documents: Vec<&'static str>, 
    pub modules: Vec<SeedModule>,
    pub instructor: &'static str,
    pub featured: &'static bool,
    pub total_duration_minutes: &'static str
}

pub fn get_seed_courses() -> Vec<SeedCourse> {
    vec![
        SeedCourse {
            title: "Rust Programming Fundamentals",
            description: "Master the fundamentals of Rust including ownership, borrowing, and lifetimes",
            status: "active",
            category: "Rust",
            level: "beginner",
            rating: &4.5,
            instructor: "DevAcademy",
            featured: &true,
            cover: "images/rust-fundamentals.jpeg",
            prerequisites: vec![],
            documents: vec![
                "courses/rust-fundamentals/rust-book.pdf",
                "courses/rust-fundamentals/cheatsheet.pdf",
                "documents/rust-fundamentals/intro/what-is-rust-slides.pdf",
                "documents/rust-fundamentals/ownership/ownership-rules.pdf",
                "documents/rust-fundamentals/ownership/borrowing-guide.pdf",
            ],
            total_duration_minutes: "30",
            modules: vec![
                SeedModule {
                    title: "Introduction to Rust",
                    order: "1",
                    module_duration_minutes: "25",
                    lessons: vec![
                        SeedLesson { 
                            title: "What is Rust?", 
                            duration_minutes: 10, 
                            prerequisites: vec![],
                            video: "videos/rust-fundamentals/intro/what-is-rust.mp4",
                            order: "1",
                            completed: &false,
                        },
                        SeedLesson { 
                            title: "Installing Rust", 
                            duration_minutes: 15, 
                            prerequisites: vec![],
                            video: "videos/rust-fundamentals/intro/installing-rust.mp4",
                            order: "2",
                            completed: &false,
                        },
                    ],
                },
                SeedModule {
                    title: "Ownership and Borrowing",
                    order: "2",
                    module_duration_minutes: "45",
                    lessons: vec![
                        SeedLesson { 
                            title: "Ownership Basics", 
                            duration_minutes: 20, 
                            prerequisites: vec!["What is Rust?"],
                            video: "videos/rust-fundamentals/ownership/ownership-basics.mp4",
                            order: "1",
                            completed: &false,
                        },
                        SeedLesson { 
                            title: "Borrowing & References", 
                            duration_minutes: 25, 
                            prerequisites: vec!["Ownership Basics"],
                            video: "videos/rust-fundamentals/ownership/borrowing-references.mp4",
                            order: "2",
                            completed: &false,
                        },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Web Development with Actix",
            description: "Build production-ready web applications using Actix-web framework",
            status: "active",
            category: "Web Development",
            level: "intermediate",
            rating: &3.5,
            instructor: "Actix",
            featured: &false,
            cover: "images/actix-web.jpeg",
            prerequisites: vec!["Rust Programming Fundamentals"],
            total_duration_minutes: "40",
            documents: vec![
                "courses/actix-web/actix-documentation.pdf",
                "courses/actix-web/rest-api-design.pdf",
                "documents/actix-web/basics/project-setup.pdf",
                "documents/actix-web/apis/serde-guide.pdf",
            ],
            modules: vec![
                SeedModule {
                    title: "Actix Basics",
                    order: "1",
                    module_duration_minutes: "35",
                    lessons: vec![
                        SeedLesson { 
                            title: "Setting up Actix", 
                            duration_minutes: 15, 
                            prerequisites: vec![],
                            video: "videos/actix-web/basics/setup-actix.mp4",
                            order: "1",
                            completed: &false,
                        },
                        SeedLesson { 
                            title: "Routing and Handlers", 
                            duration_minutes: 20, 
                            prerequisites: vec!["Setting up Actix"],
                            video: "videos/actix-web/basics/routing-handlers.mp4",
                            order: "2",
                            completed: &false,
                        },
                    ],
                },
                SeedModule {
                    title: "Building APIs",
                    order: "2",
                    module_duration_minutes: "45",
                    lessons: vec![
                        SeedLesson { 
                            title: "REST Endpoints", 
                            duration_minutes: 25, 
                            prerequisites: vec![],
                            video: "videos/actix-web/apis/rest-endpoints.mp4",
                            order: "1",
                            completed: &false,
                        },
                        SeedLesson { 
                            title: "JSON Serialization", 
                            duration_minutes: 20, 
                            prerequisites: vec!["REST Endpoints"],
                            video: "videos/actix-web/apis/json-serialization.mp4",
                            order: "2",
                            completed: &false,
                        },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Async Rust Programming",
            description: "Deep dive into async/await, tokio runtime, and concurrent programming",
            status: "active",
            category: "Rust Async",
            level: "Advanced",
            rating: &4.0,
            instructor: "DevAcademy",
            featured: &true,
            cover: "images/async-rust.jpeg",
            prerequisites: vec!["Rust Programming Fundamentals"],
            documents: vec![
                "courses/async-rust/async-book.pdf",
                "documents/async-rust/basics/futures-explained.pdf",
                "documents/async-rust/basics/tokio-runtime.pdf",
                "documents/async-rust/concurrency/task-management.pdf",
                "documents/async-rust/concurrency/channel-patterns.pdf",
            ],
            total_duration_minutes: "50",
            modules: vec![
                SeedModule {
                    title: "Async Basics",
                    order: "1",
                    module_duration_minutes: "45",
                    lessons: vec![
                        SeedLesson { 
                            title: "Futures and async/await", 
                            duration_minutes: 20, 
                            prerequisites: vec![],
                            video: "videos/async-rust/basics/futures-async-await.mp4",
                            order: "1",
                            completed: &false,
                        },
                        SeedLesson { 
                            title: "Using Tokio", 
                            duration_minutes: 25, 
                            prerequisites: vec!["Futures and async/await"],
                            video: "videos/async-rust/basics/using-tokio.mp4",
                            order: "2",
                            completed: &false,
                        },
                    ],
                },
                SeedModule {
                    title: "Concurrency Patterns",
                    order: "2",
                    module_duration_minutes: "45",
                    lessons: vec![
                        SeedLesson { 
                            title: "Tasks and Spawning", 
                            duration_minutes: 20, 
                            prerequisites: vec![],
                            video: "videos/async-rust/concurrency/tasks-spawning.mp4",
                            order: "1",
                            completed: &false,
                        },
                        SeedLesson { 
                            title: "Channels and Sync", 
                            duration_minutes: 25, 
                            prerequisites: vec!["Tasks and Spawning"],
                            video: "videos/async-rust/concurrency/channels-sync.mp4",
                            order: "2",
                            completed: &false,
                        },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Database Design with PostgreSQL",
            description: "Learn database modeling, indexing, and optimization techniques",
            status: "active",
            category: "PostgreSQL",
            level: "beginner",
            rating: &4.0,
            instructor: "PostgreSQL",
            featured: &true,
            cover: "images/postgresql.jpeg",
            prerequisites: vec![],
            total_duration_minutes: "40",
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
                    order: "1",
                    module_duration_minutes: "35",
                    lessons: vec![
                        SeedLesson { 
                            title: "ER Diagrams", 
                            duration_minutes: 15, 
                            prerequisites: vec![],
                            video: "videos/postgresql/modeling/er-diagrams.mp4",
                            order: "1",
                            completed: &false,
                        },
                        SeedLesson { 
                            title: "Normalization", 
                            duration_minutes: 20, 
                            prerequisites: vec!["ER Diagrams"],
                            video: "videos/postgresql/modeling/normalization.mp4",
                            order: "2",
                            completed: &false,
                        },
                    ],
                },
                SeedModule {
                    title: "PostgreSQL Optimization",
                    order: "2",
                    module_duration_minutes: "45",
                    lessons: vec![
                        SeedLesson { 
                            title: "Indexes", 
                            duration_minutes: 20, 
                            prerequisites: vec![],
                            video: "videos/postgresql/optimization/indexes.mp4",
                            order: "1",
                            completed: &false,
                        },
                        SeedLesson { 
                            title: "Query Tuning", 
                            duration_minutes: 25, 
                            prerequisites: vec!["Indexes"],
                            video: "videos/postgresql/optimization/query-tuning.mp4",
                            order: "2",
                            completed: &false,
                        },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Graph Databases with Neo4j",
            description: "Explore graph data modeling and Cypher query language",
            status: "active",
            category: "Neo4j",
            level: "intermediate",
            rating: &4.4,
            instructor: "PostgreSQL",
            featured: &true,
            cover: "images/neo4j.jpeg",
            prerequisites: vec![],
            documents: vec![
                "courses/neo4j/neo4j-handbook.pdf",
                "documents/neo4j/basics/graph-fundamentals.pdf",
                "documents/neo4j/basics/cypher-cheatsheet.pdf",
                "documents/neo4j/advanced/pattern-examples.pdf",
                "documents/neo4j/advanced/algorithm-guide.pdf",
            ],
            total_duration_minutes: "90",
            modules: vec![
                SeedModule {
                    title: "Graph Theory Basics",
                    order: "1",
                    module_duration_minutes: "35",
                    lessons: vec![
                        SeedLesson { 
                            title: "Nodes and Relationships", 
                            duration_minutes: 15, 
                            prerequisites: vec![],
                            video: "videos/neo4j/basics/nodes-relationships.mp4",
                            order: "1",
                            completed: &false,
                        },
                        SeedLesson { 
                            title: "Cypher Queries", 
                            duration_minutes: 20, 
                            prerequisites: vec!["Nodes and Relationships"],
                            video: "videos/neo4j/basics/cypher-queries.mp4",
                            order: "2",
                            completed: &false,
                        },
                    ],
                },
                SeedModule {
                    title: "Advanced Graph Queries",
                    order: "2",
                    module_duration_minutes: "45",
                    lessons: vec![
                        SeedLesson { 
                            title: "Pattern Matching", 
                            duration_minutes: 20, 
                            prerequisites: vec![],
                            video: "videos/neo4j/advanced/pattern-matching.mp4",
                            order: "1",
                            completed: &false,
                        },
                        SeedLesson { 
                            title: "Graph Algorithms", 
                            duration_minutes: 25, 
                            prerequisites: vec!["Pattern Matching"],
                            video: "videos/neo4j/advanced/graph-algorithms.mp4",
                            order: "2",
                            completed: &false,
                        },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Event-Driven Architecture with Kafka",
            description: "Design scalable systems using Apache Kafka and event sourcing patterns",
            status: "active",
            category: "SSE",
            level: "Advanced",
            rating: &5.0,
            instructor: "Kafka",
            featured: &false,
            cover: "images/kafka.jpeg",
            prerequisites: vec![],
            documents: vec![
                "courses/kafka/kafka-definitive-guide.pdf",
                "documents/kafka/fundamentals/kafka-architecture.pdf",
                "documents/kafka/fundamentals/producer-consumer-guide.pdf",
                "documents/kafka/event-sourcing/patterns.pdf",
                "documents/kafka/event-sourcing/integration-guide.pdf",
            ],
            total_duration_minutes: "60",
            modules: vec![
                SeedModule {
                    title: "Kafka Fundamentals",
                    order: "1",
                    module_duration_minutes: "35",
                    lessons: vec![
                        SeedLesson { 
                            title: "Topics and Partitions", 
                            duration_minutes: 15, 
                            prerequisites: vec![],
                            video: "videos/kafka/fundamentals/topics-partitions.mp4",
                            order: "1",
                            completed: &false,
                        },
                        SeedLesson { 
                            title: "Producers and Consumers", 
                            duration_minutes: 20, 
                            prerequisites: vec!["Topics and Partitions"],
                            video: "videos/kafka/fundamentals/producers-consumers.mp4",
                            order: "2",
                            completed: &false,
                        },
                    ],
                },
                SeedModule {
                    title: "Event Sourcing",
                    order: "2",
                    module_duration_minutes: "45",
                    lessons: vec![
                        SeedLesson { 
                            title: "Design Patterns", 
                            duration_minutes: 25, 
                            prerequisites: vec![],
                            video: "videos/kafka/event-sourcing/design-patterns.mp4",
                            order: "1",
                            completed: &false,
                        },
                        SeedLesson { 
                            title: "Integrating Kafka", 
                            duration_minutes: 20, 
                            prerequisites: vec!["Design Patterns"],
                            video: "videos/kafka/event-sourcing/integrating-kafka.mp4",
                            order: "2",
                            completed: &false,
                        },
                    ],
                },
            ],
        },
    ]
}

pub fn map_seed_to_course(sc: &SeedCourse) -> Course {
    let total_duration_minutes: i32 = sc.modules.iter()
        .flat_map(|m| m.lessons.iter())
        .map(|l| l.duration_minutes)
        .sum();

    Course {
        id: Uuid::new_v4().to_string(),
        title: sc.title.to_string(),
        description: sc.description.to_string(),
        status: sc.status.to_string(),
        category: sc.category.to_string(),
        level: sc.level.to_string(),
        rating: *sc.rating,
        instructor: sc.instructor.to_string(),
        featured: *sc.featured,
        cover: sc.cover.to_string(),
        prerequisites: sc.prerequisites.iter().map(|s| s.to_string()).collect(),
        documents: sc.documents.iter().map(|s| s.to_string()).collect(),
        total_duration_minutes,
    }
}
