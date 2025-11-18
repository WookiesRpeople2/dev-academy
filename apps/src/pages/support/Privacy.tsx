import { ShieldCheck } from 'lucide-react';

export function Privacy() {
  return (
    <div className="bg-zinc-950 py-16 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-violet-500" />
          <h1 className="text-3xl font-bold text-zinc-50">Politique de Confidentialité</h1>
        </div>
        
        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-zinc-50 mb-3">Collecte des données</h2>
            <p className="text-zinc-400">
              Nous collectons uniquement les informations nécessaires au bon fonctionnement de votre compte et au suivi de votre progression (email, nom, cours suivis). Nous ne vendons jamais vos données à des tiers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-50 mb-3">Utilisation des cookies</h2>
            <p className="text-zinc-400">
              Nous utilisons des cookies essentiels pour maintenir votre session active et mémoriser votre progression dans les cours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-50 mb-3">Vos droits</h2>
            <p className="text-zinc-400">
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Contactez le support pour exercer ces droits.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}