import { Calendar, User } from 'lucide-react';

export function Blog() {
  const posts = [
    {
      id: 1,
      title: "L'avenir de React en 2024",
      excerpt: "Analyse des nouvelles fonctionnalités de React 19 et de ce qu'elles changent pour les développeurs.",
      author: "Sarah Connor",
      date: "15 Nov 2023",
      category: "Tech",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 2,
      title: "Comment réussir son premier job tech",
      excerpt: "Conseils pratiques pour aborder vos premiers entretiens techniques sans stress.",
      author: "Marc Dupont",
      date: "10 Nov 2023",
      category: "Carrière",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: 3,
      title: "Docker pour les débutants",
      excerpt: "Comprendre la conteneurisation en 10 minutes avec des exemples simples.",
      author: "John Smith",
      date: "05 Nov 2023",
      category: "DevOps",
      image: "https://images.unsplash.com/photo-1605745341117-95a4c7336a54?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="bg-zinc-950 py-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-zinc-50 mb-4">Le Blog</h1>
          <p className="text-zinc-400">Actualités, tutoriels et conseils pour développeurs.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden hover:border-zinc-700 transition-colors cursor-pointer group">
              <div className="aspect-video overflow-hidden bg-zinc-800">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-blue-400 text-sm font-medium mb-2">{post.category}</div>
                <h2 className="text-xl font-semibold text-zinc-50 mb-3 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-zinc-400 text-sm line-clamp-3 mb-4 flex-grow">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-800">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {post.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {post.date}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}