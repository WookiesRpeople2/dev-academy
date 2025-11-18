import { Target, Users, Globe } from 'lucide-react';

export function About() {
  const stats = [
    { label: 'Étudiants formés', value: '15k+' },
    { label: 'Instructeurs experts', value: '50+' },
    { label: 'Pays représentés', value: '25+' },
    { label: 'Taux de satisfaction', value: '4.9/5' },
  ];

  return (
    <div className="bg-zinc-950 py-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold text-zinc-50 mb-6">
            Former la prochaine génération de <span className="text-blue-500">développeurs d'élite</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            DevAcademy est née d'un constat simple : l'éducation technologique traditionnelle n'évolue pas assez vite. Nous avons créé une plateforme qui comble le fossé entre la théorie académique et la réalité du marché.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800">
              <div className="text-3xl font-bold text-zinc-50 mb-2">{stat.value}</div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-50">Excellence Pratique</h3>
            <p className="text-zinc-400">Pas de théorie inutile. Tout ce que vous apprenez est directement applicable sur des projets réels.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-violet-500" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-50">Communauté Active</h3>
            <p className="text-zinc-400">L'apprentissage est social. Rejoignez une communauté bienveillante qui s'entraide au quotidien.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-50">Accessibilité</h3>
            <p className="text-zinc-400">Nous croyons que la qualité de l'éducation ne devrait pas dépendre de votre localisation géographique.</p>
          </div>
        </div>
      </div>
    </div>
  );
}