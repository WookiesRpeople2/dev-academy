import { Building2 } from 'lucide-react';

export function Partners() {
  const partners = ['TechCorp', 'DevStudio', 'CloudSystems', 'DataFlow', 'SecurityFirst', 'WebAgency'];

  return (
    <div className="bg-zinc-950 py-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold text-zinc-50 mb-6">Ils nous font confiance</h1>
        <p className="text-zinc-400 max-w-2xl mx-auto mb-16">
          Nous collaborons avec les meilleures entreprises technologiques pour assurer l'employabilité de nos étudiants.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {partners.map((partner) => (
            <div key={partner} className="flex items-center justify-center h-32 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 transition-colors">
              <div className="flex items-center gap-2 text-zinc-300 font-bold text-xl">
                <Building2 className="w-6 h-6 text-blue-500 opacity-50" />
                <span>{partner}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}