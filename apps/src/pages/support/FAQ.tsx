import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Comment fonctionnent les cours ?",
      answer: "Nos cours sont 100% en ligne et accessibles à votre rythme. Une fois inscrit, vous avez un accès illimité aux vidéos, quiz et exercices pratiques."
    },
    {
      question: "Obtient-on un certificat à la fin ?",
      answer: "Oui, chaque formation complétée à 100% (visionnage + réussite aux quiz) donne lieu à un certificat de réussite DevAcademy nominatif."
    },
    {
      question: "Puis-je me faire rembourser ?",
      answer: "Nous offrons une garantie 'satisfait ou remboursé' de 14 jours. Si le cours ne vous convient pas, contactez simplement le support pour un remboursement complet."
    },
    {
      question: "Les mises à jour sont-elles incluses ?",
      answer: "Absolument. Le développement évolue vite, nos cours aussi. Vous bénéficiez gratuitement de toutes les mises à jour futures des cours achetés."
    },
    {
      question: "Comment contacter les instructeurs ?",
      answer: "Chaque cours dispose d'un espace de discussion dédié où vous pouvez poser vos questions aux instructeurs et échanger avec les autres élèves."
    }
  ];

  return (
    <div className="bg-zinc-950 py-16 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
            <HelpCircle className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-50">Foire Aux Questions</h1>
          <p className="mt-4 text-zinc-400">
            Tout ce que vous devez savoir pour bien démarrer sur DevAcademy.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="font-medium text-zinc-100">{faq.question}</span>
                {openIndex === index ? (
                  <Minus className="h-5 w-5 text-blue-500" />
                ) : (
                  <Plus className="h-5 w-5 text-zinc-500" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-zinc-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}