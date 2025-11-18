import { Search, Clock, Users, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { Course } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProgrammesProps {
  featured?: boolean;
}

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Développement Web Full Stack',
    description: 'Maîtrisez React, Node.js et les bases de données pour devenir développeur full stack.',
    category: 'Web Development',
    level: 'Intermédiaire',
    duration: '12 semaines',
    students: 1245,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1657812159077-90649115008c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGRlc2lnbnxlbnwxfHx8fDE3NjMzNzI4NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    instructor: 'Marie Dubois',
    modules: [
      {
        id: 'm1',
        title: 'Introduction à React',
        lessons: [
          { id: 'l1', title: 'Qu\'est-ce que React?', duration: '15 min', type: 'video' },
          { id: 'l2', title: 'Composants et Props', duration: '20 min', type: 'video' },
          { id: 'l3', title: 'Quiz: Bases de React', duration: '10 min', type: 'quiz' },
        ]
      },
      {
        id: 'm2',
        title: 'State et Hooks',
        lessons: [
          { id: 'l4', title: 'useState Hook', duration: '25 min', type: 'video' },
          { id: 'l5', title: 'useEffect Hook', duration: '30 min', type: 'video' },
        ]
      },
      {
        id: 'm3',
        title: 'Backend avec Node.js',
        lessons: [
          { id: 'l6', title: 'Configuration de Node.js', duration: '20 min', type: 'video' },
          { id: 'l7', title: 'Express.js', duration: '35 min', type: 'video' },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Data Science avec Python',
    description: 'Apprenez l\'analyse de données, le machine learning et la visualisation avec Python.',
    category: 'Data Science',
    level: 'Débutant',
    duration: '10 semaines',
    students: 892,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1625535069703-a67ae00bd6de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMGNvZGV8ZW58MXx8fHwxNzYzMzc3MTEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    instructor: 'Thomas Martin',
    modules: [
      {
        id: 'm1',
        title: 'Fondamentaux Python',
        lessons: [
          { id: 'l1', title: 'Variables et Types', duration: '18 min', type: 'video' },
          { id: 'l2', title: 'Structures de données', duration: '25 min', type: 'video' },
        ]
      },
      {
        id: 'm2',
        title: 'NumPy et Pandas',
        lessons: [
          { id: 'l3', title: 'Introduction à NumPy', duration: '22 min', type: 'video' },
          { id: 'l4', title: 'DataFrames avec Pandas', duration: '30 min', type: 'video' },
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Développement Mobile avec React Native',
    description: 'Créez des applications mobiles natives pour iOS et Android avec React Native.',
    category: 'Mobile Development',
    level: 'Intermédiaire',
    duration: '8 semaines',
    students: 674,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1633250391894-397930e3f5f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NjMyOTQ4Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    instructor: 'Sophie Bernard',
    modules: [
      {
        id: 'm1',
        title: 'Configuration et premiers pas',
        lessons: [
          { id: 'l1', title: 'Installation de React Native', duration: '15 min', type: 'video' },
          { id: 'l2', title: 'Votre première app', duration: '20 min', type: 'video' },
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'Architecture Cloud et DevOps',
    description: 'Maîtrisez AWS, Docker, Kubernetes et les pratiques DevOps modernes.',
    category: 'Cloud & DevOps',
    level: 'Avancé',
    duration: '14 semaines',
    students: 523,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1667984390553-7f439e6ae401?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYzMjk2NDY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    instructor: 'Luc Petit',
    modules: [
      {
        id: 'm1',
        title: 'Introduction au Cloud',
        lessons: [
          { id: 'l1', title: 'Concepts du Cloud Computing', duration: '25 min', type: 'video' },
          { id: 'l2', title: 'Services AWS', duration: '30 min', type: 'video' },
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'Sécurité et Ethical Hacking',
    description: 'Apprenez les techniques de sécurité informatique et de tests de pénétration.',
    category: 'Cybersecurity',
    level: 'Avancé',
    duration: '16 semaines',
    students: 438,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1691435828932-911a7801adfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwbmV0d29ya3xlbnwxfHx8fDE3NjMzNzA0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    instructor: 'Pierre Rousseau',
    modules: [
      {
        id: 'm1',
        title: 'Fondamentaux de la sécurité',
        lessons: [
          { id: 'l1', title: 'Introduction à la cybersécurité', duration: '20 min', type: 'video' },
          { id: 'l2', title: 'Vulnérabilités communes', duration: '28 min', type: 'video' },
        ]
      }
    ]
  },
  {
    id: '6',
    title: 'JavaScript Moderne et TypeScript',
    description: 'Maîtrisez ES6+, TypeScript et les patterns avancés de JavaScript.',
    category: 'Web Development',
    level: 'Intermédiaire',
    duration: '6 semaines',
    students: 1532,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1566915896913-549d796d2166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBjb2RpbmclMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYzMzMzMTkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    instructor: 'Claire Laurent',
    modules: [
      {
        id: 'm1',
        title: 'JavaScript ES6+',
        lessons: [
          { id: 'l1', title: 'Arrow Functions', duration: '12 min', type: 'video' },
          { id: 'l2', title: 'Promises et Async/Await', duration: '25 min', type: 'video' },
        ]
      }
    ]
  }
];

export function Programmes({ featured = false }: ProgrammesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const categories = ['Tous', 'Web Development', 'Data Science', 'Mobile Development', 'Cloud & DevOps', 'Cybersecurity'];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayCourses = featured ? filteredCourses.slice(0, 3) : filteredCourses;

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
              : 'Explorez notre catalogue complet de formations professionnelles'
            }
          </p>
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
                  className={selectedCategory === category 
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

                <p className="mb-4 text-sm text-zinc-400 line-clamp-2">
                  {course.description}
                </p>

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
              <Button 
                variant="outline"
                className="border-zinc-700 bg-zinc-900/50 text-zinc-100 hover:bg-zinc-800 hover:text-zinc-50"
              >
                Voir tous les cours
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}