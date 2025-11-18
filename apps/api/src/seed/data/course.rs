use api::models::programe::{Course, Module, Lesson};
use uuid::Uuid;

#[derive(Debug)]
pub struct SeedLesson {
    pub title: &'static str,
    pub duration_minutes: i32,
    pub prerequisites: Vec<&'static str>,
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
    pub prerequisites: Vec<&'static str>,
    pub modules: Vec<SeedModule>,
}

pub fn get_seed_courses() -> Vec<Course> {
    let seed_courses = vec![
        SeedCourse {
            title: "Rust Programming Fundamentals",
            description: "Master the fundamentals of Rust including ownership, borrowing, and lifetimes",
            status: "active",
            prerequisites: vec![],
            modules: vec![
                SeedModule {
                    title: "Introduction to Rust",
                    lessons: vec![
                        SeedLesson { title: "What is Rust?", duration_minutes: 10, prerequisites: vec![] },
                        SeedLesson { title: "Installing Rust", duration_minutes: 15, prerequisites: vec![] },
                    ],
                },
                SeedModule {
                    title: "Ownership and Borrowing",
                    lessons: vec![
                        SeedLesson { title: "Ownership Basics", duration_minutes: 20, prerequisites: vec!["What is Rust?"] },
                        SeedLesson { title: "Borrowing & References", duration_minutes: 25, prerequisites: vec!["Ownership Basics"] },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Web Development with Actix",
            description: "Build production-ready web applications using Actix-web framework",
            status: "active",
            prerequisites: vec!["Rust Programming Fundamentals"],
            modules: vec![
                SeedModule {
                    title: "Actix Basics",
                    lessons: vec![
                        SeedLesson { title: "Setting up Actix", duration_minutes: 15, prerequisites: vec![] },
                        SeedLesson { title: "Routing and Handlers", duration_minutes: 20, prerequisites: vec!["Setting up Actix"] },
                    ],
                },
                SeedModule {
                    title: "Building APIs",
                    lessons: vec![
                        SeedLesson { title: "REST Endpoints", duration_minutes: 25, prerequisites: vec![] },
                        SeedLesson { title: "JSON Serialization", duration_minutes: 20, prerequisites: vec!["REST Endpoints"] },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Async Rust Programming",
            description: "Deep dive into async/await, tokio runtime, and concurrent programming",
            status: "active",
            prerequisites: vec!["Rust Programming Fundamentals"],
            modules: vec![
                SeedModule {
                    title: "Async Basics",
                    lessons: vec![
                        SeedLesson { title: "Futures and async/await", duration_minutes: 20, prerequisites: vec![] },
                        SeedLesson { title: "Using Tokio", duration_minutes: 25, prerequisites: vec!["Futures and async/await"] },
                    ],
                },
                SeedModule {
                    title: "Concurrency Patterns",
                    lessons: vec![
                        SeedLesson { title: "Tasks and Spawning", duration_minutes: 20, prerequisites: vec![] },
                        SeedLesson { title: "Channels and Sync", duration_minutes: 25, prerequisites: vec!["Tasks and Spawning"] },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Database Design with PostgreSQL",
            description: "Learn database modeling, indexing, and optimization techniques",
            status: "active",
            prerequisites: vec![],
            modules: vec![
                SeedModule {
                    title: "Relational Modeling",
                    lessons: vec![
                        SeedLesson { title: "ER Diagrams", duration_minutes: 15, prerequisites: vec![] },
                        SeedLesson { title: "Normalization", duration_minutes: 20, prerequisites: vec!["ER Diagrams"] },
                    ],
                },
                SeedModule {
                    title: "PostgreSQL Optimization",
                    lessons: vec![
                        SeedLesson { title: "Indexes", duration_minutes: 20, prerequisites: vec![] },
                        SeedLesson { title: "Query Tuning", duration_minutes: 25, prerequisites: vec!["Indexes"] },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Graph Databases with Neo4j",
            description: "Explore graph data modeling and Cypher query language",
            status: "active",
            prerequisites: vec![],
            modules: vec![
                SeedModule {
                    title: "Graph Theory Basics",
                    lessons: vec![
                        SeedLesson { title: "Nodes and Relationships", duration_minutes: 15, prerequisites: vec![] },
                        SeedLesson { title: "Cypher Queries", duration_minutes: 20, prerequisites: vec!["Nodes and Relationships"] },
                    ],
                },
                SeedModule {
                    title: "Advanced Graph Queries",
                    lessons: vec![
                        SeedLesson { title: "Pattern Matching", duration_minutes: 20, prerequisites: vec![] },
                        SeedLesson { title: "Graph Algorithms", duration_minutes: 25, prerequisites: vec!["Pattern Matching"] },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Event-Driven Architecture with Kafka",
            description: "Design scalable systems using Apache Kafka and event sourcing patterns",
            status: "active",
            prerequisites: vec![],
            modules: vec![
                SeedModule {
                    title: "Kafka Fundamentals",
                    lessons: vec![
                        SeedLesson { title: "Topics and Partitions", duration_minutes: 15, prerequisites: vec![] },
                        SeedLesson { title: "Producers and Consumers", duration_minutes: 20, prerequisites: vec!["Topics and Partitions"] },
                    ],
                },
                SeedModule {
                    title: "Event Sourcing",
                    lessons: vec![
                        SeedLesson { title: "Design Patterns", duration_minutes: 25, prerequisites: vec![] },
                        SeedLesson { title: "Integrating Kafka", duration_minutes: 20, prerequisites: vec!["Design Patterns"] },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Microservices Architecture",
            description: "Build and deploy distributed systems with Rust microservices",
            status: "active",
            prerequisites: vec!["Rust Programming Fundamentals", "Async Rust Programming"],
            modules: vec![
                SeedModule {
                    title: "Microservices Basics",
                    lessons: vec![
                        SeedLesson { title: "Service Design", duration_minutes: 20, prerequisites: vec![] },
                        SeedLesson { title: "Inter-Service Communication", duration_minutes: 25, prerequisites: vec!["Service Design"] },
                    ],
                },
                SeedModule {
                    title: "Deployment Strategies",
                    lessons: vec![
                        SeedLesson { title: "Containers and Kubernetes", duration_minutes: 30, prerequisites: vec![] },
                        SeedLesson { title: "Monitoring Microservices", duration_minutes: 20, prerequisites: vec!["Containers and Kubernetes"] },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Redis Caching Strategies",
            description: "Implement efficient caching patterns for high-performance applications",
            status: "active",
            prerequisites: vec![],
            modules: vec![
                SeedModule {
                    title: "Redis Basics",
                    lessons: vec![
                        SeedLesson { title: "Data Structures", duration_minutes: 15, prerequisites: vec![] },
                        SeedLesson { title: "Key Expiration", duration_minutes: 10, prerequisites: vec!["Data Structures"] },
                    ],
                },
                SeedModule {
                    title: "Advanced Caching",
                    lessons: vec![
                        SeedLesson { title: "Cache Invalidation", duration_minutes: 20, prerequisites: vec![] },
                        SeedLesson { title: "High Availability", duration_minutes: 25, prerequisites: vec!["Cache Invalidation"] },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "System Design Fundamentals",
            description: "Learn to design scalable and reliable distributed systems",
            status: "draft",
            prerequisites: vec![],
            modules: vec![
                SeedModule {
                    title: "Scalability Concepts",
                    lessons: vec![
                        SeedLesson { title: "Load Balancing", duration_minutes: 20, prerequisites: vec![] },
                        SeedLesson { title: "Caching Strategies", duration_minutes: 20, prerequisites: vec!["Load Balancing"] },
                    ],
                },
                SeedModule {
                    title: "Reliability & Fault Tolerance",
                    lessons: vec![
                        SeedLesson { title: "Redundancy", duration_minutes: 15, prerequisites: vec![] },
                        SeedLesson { title: "Monitoring & Alerts", duration_minutes: 25, prerequisites: vec!["Redundancy"] },
                    ],
                },
            ],
        },
        SeedCourse {
            title: "Rust Performance Optimization",
            description: "Advanced techniques for profiling and optimizing Rust applications",
            status: "active",
            prerequisites: vec!["Rust Programming Fundamentals"],
            modules: vec![
                SeedModule {
                    title: "Profiling Tools",
                    lessons: vec![
                        SeedLesson { title: "Using `cargo-profiler`", duration_minutes: 15, prerequisites: vec![] },
                        SeedLesson { title: "Benchmarking Code", duration_minutes: 20, prerequisites: vec!["Using `cargo-profiler`"] },
                    ],
                },
                SeedModule {
                    title: "Optimization Techniques",
                    lessons: vec![
                        SeedLesson { title: "Memory Management", duration_minutes: 25, prerequisites: vec![] },
                        SeedLesson { title: "Algorithm Optimization", duration_minutes: 30, prerequisites: vec!["Memory Management"] },
                    ],
                },
            ],
        },
    ];

    // Convert SeedCourse -> Course with UUIDs and calculated durations
    seed_courses.into_iter().map(|sc| {
        let modules: Vec<Module> = sc.modules.into_iter().enumerate().map(|(i, m)| {
            let lessons: Vec<Lesson> = m.lessons.into_iter().enumerate().map(|(j, l)| Lesson {
                id: Uuid::new_v4().to_string(),
                title: l.title.to_string(),
                order: j as i32 + 1,
                duration_minutes: l.duration_minutes,
                prerequisites: l.prerequisites.into_iter().map(|s| s.to_string()).collect(),
                completed: false,
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
            prerequisites: sc.prerequisites.into_iter().map(|s| s.to_string()).collect(),
            modules,
            total_duration_minutes,
        }
    }).collect()
}

