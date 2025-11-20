import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/providers/authProvider";
import { RequireAuth } from "@/providers/authProvider";
import { Footer } from "react-day-picker";
import { FAQ } from "./pages/support/FAQ";
import { Terms } from "./pages/support/Terms";
import { Privacy } from "./pages/support/Privacy";
import { About } from "./pages/company/About";
import { Team } from "./pages/company/Team";
import { Careers } from "./pages/company/Carrers";
import { Blog } from "./pages/company/Blog";
import { Partners } from "./pages/company/Partners";
import { Contact} from "lucide-react";
import { Course } from "./components/course";
import { HomePage } from "./pages/home/home";
import { Programmes } from "./components/Programmes";
import { Inscription } from "./components/Inscription";
import { Connexion } from "./pages/auth/Connexion";
import { Navigation } from "./components/Navigation";

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

              <Route
                path="/cours/:id"
                element={
                  <RequireAuth>
                    <Course />
                  </RequireAuth>
                }
              />

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

