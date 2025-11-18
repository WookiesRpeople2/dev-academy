import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Contact } from "./components/Contact";
import { CourseViewer } from "./components/CourseViewer";
import { Footer } from "./components/Footer";
import { Programmes, mockCourses } from "./components/Programmes";
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
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-50">
        <Navigation />
        
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero onGetStarted={() => null} /> 
                <Programmes featured={true} />
              </>
            } />

            <Route path="/programmes" element={
              <Programmes />
            } />

            <Route path="/cours/:id" element={<CourseViewerWrapper />} />

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
  );
}