import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseViewer } from "./CourseViewer";

export interface Lesson {
  id: string;
  title: string;
  duration: string; 
  type: "video" | "article" | "quiz";
  completed: boolean;
  video?: string;
  order: number;
}

export interface ModuleWithLessons {
  module: {
    id: string;
    title: string;
    order: number;
    module_duration_minutes: number;
  };
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  students: number;
  rating: number;
  image: string;
  instructor: string;
  documents: string[];
  modules: ModuleWithLessons[];
}


export const Course = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:9090/api');

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(`${API_BASE}/programs/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("API response:", data);

        const program = data?.program;
        if (!program || !program.course) return;

        const base = program.course;

  const modules: ModuleWithLessons[] = Array.isArray(program.modules)
    ? program.modules
        .map((mw: any) => ({
          module: {
            id: String(mw.module.id),
            title: String(mw.module.title),
            order: mw.module.order ?? 0,
            module_duration_minutes: mw.module.module_duration_minutes ?? 0,
          },
          lessons: Array.isArray(mw.lessons)
            ? mw.lessons
                .map((l: any) => ({
                  id: String(l.id),
                  title: String(l.title),
                  duration: `${Number(l.duration_minutes ?? 0)} min`,
                  type: "video", // adjust if backend provides type
                  completed: Boolean(l.completed ?? false),
                  video: l.video,
                  order: l.order ?? 0, // make sure lessons have an order
                }))
                .sort((a: {order: Number}, b: {order: Number}) => a.order - b.order) // sort lessons by order
            : [],
        }))
        .sort((a, b) => a.module.order - b.module.order) // sort modules by order
    : [];

        const adapted: Course = {
          id: String(base.id),
          title: base.title,
          description: base.description,
          category: base.category ?? "Web Development",
          level: base.level ?? "Beginner",
          duration: `${base.total_duration_minutes ?? 0} min`,
          students: 0,
          rating: base.rating ?? 0,
          image: base.cover ?? "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&q=80&w=1080",
          instructor: base.instructor ?? "Unknown",
          documents: base.documents,
          modules,
        };

        if (active) setCourse(adapted);
      })
      .catch(console.error)
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [API_BASE, id]);

  if (loading) {
    return <div className="text-center pt-20">Chargement…</div>;
  }
  if (!course) {
    return <div className="text-center pt-20">Cours non trouvé</div>;
  }
  return (
    <CourseViewer
      course={course}
      onBack={() => navigate('/programmes')}
    />
  );
};

