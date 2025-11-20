import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseViewer } from "./CourseViewer";

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
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "article" | "quiz";
  completed?: boolean;
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
        const detail = Array.isArray(data?.program) ? data.program[0] : null;
        if (!detail) return;
        const base = detail.course ?? {};
        const modules = Array.isArray(detail.modules) ? detail.modules.map((mw: any) => ({
          id: String(mw?.module?.id ?? ''),
          title: String(mw?.module?.title ?? ''),
          lessons: Array.isArray(mw?.lessons) ? mw.lessons.map((l: any) => ({
            id: String(l.id ?? ''),
            title: String(l.title ?? ''),
            duration: `${Number(l.duration_minutes ?? 0)} min`,
            type: 'video',
            completed: Boolean(l.completed ?? false),
          })) : [],
        })) : [];
        const adapted: Course = {
          id: String(base.id ?? ''),
          title: String(base.title ?? ''),
          description: String(base.description ?? ''),
          category: 'Web Development',
          level: base.status === 'active' ? 'Intermédiaire' : 'Débutant',
          duration: `${Number(base.total_duration_minutes ?? 0)} min`,
          students: 0,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&q=80&w=1080',
          instructor: 'DevAcademy',
          modules,
        };
        if (active) setCourse(adapted);
      })
      .catch(() => { })
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

