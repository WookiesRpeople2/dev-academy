import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate, useLocation } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Contact } from "./components/Contact";
import { CourseViewer } from "./components/CourseViewer";
import { Footer } from "./components/Footer";
import { Programmes, mockCourses } from "./components/Programmes";
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
    const onAuthChanged = () => setIsAuthenticated(localStorage.getItem("auth") === "true");
    window.addEventListener("auth-changed", onAuthChanged as EventListener);
    window.addEventListener("storage", onAuthChanged as EventListener);
    return () => {
      window.removeEventListener("auth-changed", onAuthChanged as EventListener);
      window.removeEventListener("storage", onAuthChanged as EventListener);
    };
  }, []);
  const login = () => {
    localStorage.setItem("auth", "true");
    setIsAuthenticated(true);
  };
  const logout = () => {
    localStorage.setItem("auth", "false");
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
  
  const course = mockCourses.find(c => c.id === id);
  
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