import { useState } from 'react';
import { ArrowLeft, Play, BookOpen, CheckCircle, Clock, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import type { Course, Lesson } from './course';
import { CourseDocuments } from './docs';

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
}

export function CourseViewer({ course, onBack }: CourseViewerProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(course.modules[0].lessons[0]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const progress = (completedLessons.size / totalLessons) * 100;
  const modulesWithFilteredLessons = course.modules
    .map((module) => ({
      ...module,
      lessons: module.lessons
        .filter((lesson) => lesson.order === module.module.order) // only keep lessons matching module order
        .sort((a, b) => a.order - b.order), // sort by lesson order
    }))
    .sort((a, b) => a.module.order - b.module.order); // sort modules

  const handleLessonComplete = () => {
    setCompletedLessons(new Set([...completedLessons, selectedLesson.id]));
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (completedLessons.has(lesson.id)) return <CheckCircle className="h-5 w-5 text-green-500" />;
    switch (lesson.type) {
      case 'video':
        return <Play className="h-5 w-5 text-blue-400" />;
      case 'article':
        return <BookOpen className="h-5 w-5 text-violet-400" />;
      case 'quiz':
        return <Award className="h-5 w-5 text-yellow-400" />;
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-zinc-50">{course.title}</h2>
              <p className="text-sm text-zinc-400">{course.instructor}</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm text-zinc-400">Progression</p>
            <p className="text-zinc-100">{Math.round(progress)}%</p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
          <Progress value={progress} className="h-2 bg-zinc-800" />
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 py-6 lg:grid-cols-3">
          {/* Lesson Player */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <div className="relative aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900">
                {selectedLesson.type === 'video' && selectedLesson.video ? (
                  <video
                    src={`http://localhost:4566/${selectedLesson.video}`}
                    controls
                    autoPlay
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20">
                        {getLessonIcon(selectedLesson)}
                      </div>
                      <h3 className="mb-2 text-zinc-100">{selectedLesson.title}</h3>
                      <p className="text-sm text-zinc-400">{selectedLesson.duration}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson info */}
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="mb-1 text-zinc-50">{selectedLesson.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Clock className="h-4 w-4" />
                      <span>{selectedLesson.duration}</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleLessonComplete}
                    disabled={completedLessons.has(selectedLesson.id)}
                    className={
                      completedLessons.has(selectedLesson.id)
                        ? 'bg-green-500/20 text-green-400 border-green-500/30 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white border-0'
                    }
                  >
                    {completedLessons.has(selectedLesson.id) ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Terminé
                      </>
                    ) : (
                      'Marquer comme terminé'
                    )}
                  </Button>
                </div>

                {selectedLesson.type !== 'video' && (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-zinc-400">
                      Bienvenue dans cette leçon. Le contenu sera affiché ici.
                    </p>
                    <p className="text-zinc-400">
                      N'hésitez pas à mettre la leçon en pause pour expérimenter par vous-même.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Curriculum */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <div className="border-b border-zinc-800 p-4">
                <h3 className="text-zinc-50">Contenu du cours</h3>
                <p className="text-sm text-zinc-400">
                  {completedLessons.size} / {totalLessons} leçons
                </p>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {modulesWithFilteredLessons.map((module) => (
                <div key={module.module.id} className="border-b border-zinc-800 last:border-0">
                  <div className="bg-zinc-800/50 p-4">
                    <p className="text-sm text-zinc-300">
                      Module {module.module.order}: {module.module.title}
                    </p>
                  </div>
                  <div>
                    {module.lessons.map((lesson) => {
                      const isSelected = selectedLesson.id === lesson.id;
                      const isCompleted = completedLessons.has(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className={`flex w-full items-start gap-3 p-4 text-left transition-colors ${
                            isSelected
                              ? 'bg-blue-500/10 border-l-2 border-blue-500'
                              : 'hover:bg-zinc-800/50'
                          }`}
                        >
                          <div className="mt-0.5">{getLessonIcon(lesson)}</div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm ${
                                isSelected ? 'text-zinc-100' : 'text-zinc-300'
                              } ${isCompleted ? 'line-through' : ''}`}
                            >
                              {lesson.order}. {lesson.title}
                            </p>
                            <p className="text-xs text-zinc-500">{lesson.duration}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
        <CourseDocuments documents={course.documents} />
      </div>
    </div>
  );
}


