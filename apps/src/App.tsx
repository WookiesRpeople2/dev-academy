import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Programmes } from "./components/Programmes";
import { Inscription } from "./components/Inscription";
import { Documents } from "./components/Documents";
import { Contact } from "./components/Contact";
import { CourseViewer } from "./components/CourseViewer";
import { Footer } from "./components/Footer";

export type Page =
  | "home"
  | "programmes"
  | "inscription"
  | "documents"
  | "contact"
  | "course-viewer";

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

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [selectedCourse, setSelectedCourse] =
    useState<Course | null>(null);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentPage("course-viewer");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <>
            <Hero
              onGetStarted={() => setCurrentPage("programmes")}
            />
            <Programmes
              onSelectCourse={handleSelectCourse}
              featured={true}
            />
          </>
        );
      case "programmes":
        return (
          <Programmes onSelectCourse={handleSelectCourse} />
        );
      case "inscription":
        return <Inscription />;
      case "documents":
        return <Documents />;
      case "contact":
        return <Contact />;
      case "course-viewer":
        return selectedCourse ? (
          <CourseViewer
            course={selectedCourse}
            onBack={() => setCurrentPage("programmes")}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
}