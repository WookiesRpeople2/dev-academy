import { ArrowRight, Code, Zap, Trophy } from 'lucide-react';
import { Button } from './ui/button';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-violet-500/10 to-pink-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-2 backdrop-blur-sm">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-zinc-300">Plateforme de formation pour développeurs</span>
          </div>
          
          <h1 className="mb-6 bg-gradient-to-br from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Développez vos compétences avec DevAcademy
          </h1>
          
          <p className="mb-10 text-zinc-400 max-w-2xl mx-auto">
            Accédez à des cours de qualité professionnelle, créés par des experts de l'industrie. 
            Apprenez à votre rythme et obtenez des certifications reconnues.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white border-0 group"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              className="border-zinc-700 bg-zinc-900/50 text-zinc-100 hover:bg-zinc-800 hover:text-zinc-50"
            >
              Explorer les cours
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="mb-3 rounded-xl bg-blue-500/10 p-3">
                <Code className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-zinc-100">150+ Cours</div>
              <div className="text-sm text-zinc-500">Dans tous les domaines</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-3 rounded-xl bg-violet-500/10 p-3">
                <Trophy className="h-6 w-6 text-violet-500" />
              </div>
              <div className="text-zinc-100">10,000+ Étudiants</div>
              <div className="text-sm text-zinc-500">Déjà formés</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-3 rounded-xl bg-pink-500/10 p-3">
                <Zap className="h-6 w-6 text-pink-500" />
              </div>
              <div className="text-zinc-100">95% Satisfaction</div>
              <div className="text-sm text-zinc-500">Taux de réussite</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
