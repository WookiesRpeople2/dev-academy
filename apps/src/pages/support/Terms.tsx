import { FileText } from 'lucide-react';

export function Terms() {
  return (
    <div className="bg-zinc-950 py-16 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <FileText className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-zinc-50">Conditions d'Utilisation</h1>
        </div>
        
        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-zinc-50 mb-3">1. Acceptation des conditions</h2>
            <p className="text-zinc-400">
              En accédant à DevAcademy, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables, et acceptez que vous êtes responsable du respect des lois locales applicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-50 mb-3">2. Licence d'utilisation</h2>
            <p className="text-zinc-400">
              Il est permis de télécharger temporairement une copie des documents (information ou logiciel) sur le site de DevAcademy pour un visionnage transitoire personnel et non commercial uniquement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-50 mb-3">3. Clause de non-responsabilité</h2>
            <p className="text-zinc-400">
              Les documents sur le site de DevAcademy sont fournis "tels quels". DevAcademy ne donne aucune garantie, expresse ou implicite, et décline par la présente toutes les autres garanties.
            </p>
          </section>
          
          <div className="pt-8 border-t border-zinc-800 text-sm text-zinc-500">
            Dernière mise à jour : 18 Novembre 2023
          </div>
        </div>
      </div>
    </div>
  );
}