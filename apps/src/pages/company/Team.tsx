import { Github, Linkedin, Twitter } from 'lucide-react';

export function Team() {
  const team = [
    {
      name: 'Sarah Connor',
      role: 'Fondatrice & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
      bio: 'Ancienne Tech Lead chez Google, passionnée par l\'éducation.'
    },
    {
      name: 'John Smith',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
      bio: 'Architecte cloud certifié et contributeur Open Source majeur.'
    },
    {
      name: 'Emily Chen',
      role: 'Head of Content',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400',
      bio: 'Expertise en pédagogie numérique et design d\'apprentissage.'
    },
    {
      name: 'Marc Dupont',
      role: 'Lead Instructor',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      bio: '10 ans d\'expérience en développement Fullstack et mentorat.'
    }
  ];

  return (
    <div className="bg-zinc-950 py-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-zinc-50">Rencontrez l'équipe</h1>
          <p className="mt-4 text-zinc-400">Les passionnés derrière votre apprentissage.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="group rounded-xl bg-zinc-900/50 p-6 border border-zinc-800 hover:border-zinc-700 transition-colors">
              <div className="aspect-square mb-6 overflow-hidden rounded-xl bg-zinc-800">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-semibold text-zinc-50">{member.name}</h3>
              <p className="text-sm text-blue-400 mb-2">{member.role}</p>
              <p className="text-sm text-zinc-400 mb-4">{member.bio}</p>
              <div className="flex gap-3">
                <Linkedin className="w-4 h-4 text-zinc-500 hover:text-zinc-300 cursor-pointer" />
                <Twitter className="w-4 h-4 text-zinc-500 hover:text-zinc-300 cursor-pointer" />
                <Github className="w-4 h-4 text-zinc-500 hover:text-zinc-300 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}