import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate, useLocation } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Contact } from "./components/Contact";
import { CourseViewer } from "./components/CourseViewer";
import { Footer } from "./components/Footer";
import { Programmes } from "./components/Programmes";
import { Inscription } from "./components/Inscription";
import { Connexion } from "./pages/auth/Connexion";
import { FAQ } from "./pages/support/FAQ";
import { Terms } from "./pages/support/Terms";
import { Privacy } from "./pages/support/Privacy";
import { About } from "./pages/company/About";
import { Team } from "./pages/company/Team";
import { Careers } from "./pages/company/Carrers";
import { Blog } from "./pages/company/Blog";
import { Partners } from "./pages/company/Partners";
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

type AuthContextValue = { isAuthenticated: boolean; login: () => void; logout: () => void };
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider manquant");
  return ctx;
}
function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const SECRET = "devacademy-demo-secret";
  async function validateToken() {
    try {
      const payloadStr = localStorage.getItem("tokenPayload");
      const sig = localStorage.getItem("tokenSig");
      if (!payloadStr || !sig) return false;
      const payload = JSON.parse(payloadStr);
      if (!payload?.exp || payload?.exp < Math.floor(Date.now() / 1000)) return false;
      const data = new TextEncoder().encode(payloadStr + SECRET);
      const digest = await crypto.subtle.digest("SHA-256", data);
      const arr = Array.from(new Uint8Array(digest));
      const hex = arr.map((b) => b.toString(16).padStart(2, "0")).join("");
      return hex === sig;
    } catch {
      return false;
    }
  }
  useEffect(() => {
    validateToken().then((ok) => setIsAuthenticated(ok));
    const onAuthChanged = () => {
      validateToken().then((ok) => setIsAuthenticated(ok));
    };
    window.addEventListener("auth-changed", onAuthChanged as EventListener);
    window.addEventListener("storage", onAuthChanged as EventListener);
    return () => {
      window.removeEventListener("auth-changed", onAuthChanged as EventListener);
      window.removeEventListener("storage", onAuthChanged as EventListener);
    };
  }, []);
  const login = () => {
    validateToken().then((ok) => setIsAuthenticated(ok));
  };
  const logout = () => {
    localStorage.removeItem("tokenPayload");
    localStorage.removeItem("tokenSig");
    localStorage.removeItem("tokenExp");
    localStorage.removeItem("currentUser");
    setIsAuthenticated(false);
  };
  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
};

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Hero onGetStarted={() => navigate("/programmes")} />
      <Programmes featured={true} />
    </>
  );
};

const CourseViewerWrapper = () => {
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
      .catch(() => {})
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-950 text-zinc-50">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/programmes" element={<Programmes />} />
              <Route path="/inscription" element={<Inscription />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="/cours/:id" element={<RequireAuth><CourseViewerWrapper /></RequireAuth>} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<div className="p-20 text-center">Page non trouvée</div>} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/cgu" element={<Terms />} />
              <Route path="/confidentialite" element={<Privacy />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/equipe" element={<Team />} />
              <Route path="/carrieres" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/partenaires" element={<Partners />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}