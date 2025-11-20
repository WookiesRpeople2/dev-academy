// Clean fixed Programmes.tsx
import { Search, Clock, Users, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Course } from './course';

export function Programmes() {
  const location = useLocation();
  const featured = location.pathname === '/'; // featured only on homepage

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchResults, setSearchResults] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:9090/api';

  const derivedCategories = Array.from(
    new Set((searchResults ?? courses).map((c) => c.category).filter(Boolean))
  );
  const categories = ['Tous', ...derivedCategories] as string[];

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/programs`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        const list = Array.isArray(data?.programs) ? data.programs : [];

        const adapted: Course[] = list.map((c: any) => ({
          id: String(c.id ?? ''),
          title: String(c.title ?? ''),
          description: String(c.description ?? ''),
          category: String(c.category ?? 'Autre'),
          level: String(c.level ?? 'Débutant'),
          duration: `${Number(c.total_duration_minutes ?? 0)} min`,
          students: Number(c.students ?? 0),
          rating: Number(c.rating ?? 4.8),
          image: c.cover ? `http://localhost:4566/${c.cover}` : 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&q=80&w=1080',
          instructor: String(c.instructor ?? 'DevAcademy'),
          modules: Array.isArray(c.modules)
            ? c.modules.map((m: any) => ({
              id: String(m.id ?? ''),
              title: String(m.title ?? ''),
              lessons: Array.isArray(m.lessons)
                ? m.lessons.map((l: any) => ({
                  id: String(l.id ?? ''),
                  title: String(l.title ?? ''),
                  duration: `${Number(l.duration_minutes ?? 0)} min`,
                  type: String(l.type ?? 'video'),
                  completed: Boolean(l.completed ?? false),
                }))
                : [],
            }))
            : [],
        }));

        setCourses(adapted);
      })
      .catch((e) => active && setError(String(e.message || e)))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [API_BASE]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('cat');
    if (cat && categories.includes(cat)) setSelectedCategory(cat);
  }, [location.search, categories]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    let active = true;
    const controller = new AbortController();

    const runSearch = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE}/programs/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            query: searchQuery,
            fields: ['title', 'description', 'category'],
            from: 0,
            size: 50,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!active) return;

        const adapted: Course[] = Array.isArray(data?.results)
          ? data.results.map((r: any) => ({
            id: String(r.id ?? ''),
            title: String(r.title ?? ''),
            description: String(r.description ?? ''),
            category: String(r.category ?? 'Autre'),
            level: String(r.level ?? 'Débutant'),
            duration: `${Number(r.total_duration_minutes ?? 0)} min`,
            students: Number(r.students ?? 0),
            rating: Number(r.rating ?? 4.8),
            image: r.cover ? `http://localhost:4566/${r.cover}` : 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&q=80&w=1080',
            instructor: String(r.instructor ?? 'DevAcademy'),
            modules: Array.isArray(r.modules) ? r.modules : [],
          }))
          : [];

        setSearchResults(adapted);
      } catch (err: any) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    runSearch();

    return () => {
      active = false;
      controller.abort();
    };
  }, [searchQuery, API_BASE]);

  const baseCourses = courses.length ? courses : [];
  const afterSearch = searchResults ?? baseCourses;

  const filteredByCategory =
    selectedCategory === 'Tous'
      ? afterSearch
      : afterSearch.filter((c) => c.category === selectedCategory);

  const displayCourses = featured ? filteredByCategory.slice(0, 3) : filteredByCategory;

  return (
    <div className="bg-zinc-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="mb-4 text-zinc-50">
            {featured ? 'Cours Populaires' : 'Tous nos Programmes'}
          </h2>
          <p className="text-zinc-400 max-w-2xl">
            {featured
              ? 'Découvrez nos cours les plus appréciés par les développeurs'
              : 'Explorez notre catalogue complet de formations professionnelles'}
          </p>
          {!featured && (
            <div className="mt-2 text-sm text-zinc-400">
              {loading && 'Chargement…'}
              {!loading && error && 'Erreur de chargement des programmes'}
            </div>
          )}
        </div>

        {!featured && (
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
              <Input
                type="text"
                placeholder="Rechercher un cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={
                    selectedCategory === category
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-0'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50'
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayCourses.map((course) => (
            <Link
              key={course.id}
              to={`/cours/${course.id}`}
              className="group cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="relative aspect-video overflow-hidden bg-zinc-800">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute right-3 top-3">
                  <Badge className="bg-zinc-950/80 text-zinc-100 border-zinc-700 backdrop-blur-sm">
                    {course.level}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400">
                    {course.category}
                  </Badge>
                </div>

                <h3 className="mb-2 text-zinc-50 group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>

                <p className="mb-4 text-sm text-zinc-400 line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-zinc-300">{course.rating}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-sm text-zinc-500">
                    Instructeur: <span className="text-zinc-300">{course.instructor}</span>
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {featured && (
          <div className="mt-8 text-center">
            <Link to="/programmes">
              <Button variant="outline" className="border-zinc-700 bg-zinc-900/50 text-zinc-100 hover:bg-zinc-800 hover:text-zinc-50">
                Voir tous les cours
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

