import { FileText, Download, Calendar, FileCode, FileSpreadsheet, Presentation } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface Document {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'code' | 'excel' | 'presentation';
  category: string;
  size: string;
  date: string;
}

const documents: Document[] = [
  {
    id: '1',
    title: 'Guide de démarrage rapide',
    description: 'Tout ce que vous devez savoir pour commencer sur DevAcademy',
    type: 'pdf',
    category: 'Général',
    size: '2.4 MB',
    date: '2024-11-15'
  },
  {
    id: '2',
    title: 'Certificat de formation - Template',
    description: 'Modèle de certificat pour vos formations complétées',
    type: 'pdf',
    category: 'Certificats',
    size: '856 KB',
    date: '2024-11-10'
  },
  {
    id: '3',
    title: 'Cheat Sheet React',
    description: 'Référence rapide pour les hooks et patterns React',
    type: 'pdf',
    category: 'Web Development',
    size: '1.2 MB',
    date: '2024-11-08'
  },
  {
    id: '4',
    title: 'Exemples de code - Full Stack',
    description: 'Code source complet pour le cours Full Stack',
    type: 'code',
    category: 'Web Development',
    size: '5.8 MB',
    date: '2024-11-05'
  },
  {
    id: '5',
    title: 'Dataset Python - Exercices',
    description: 'Jeux de données pour les exercices de Data Science',
    type: 'excel',
    category: 'Data Science',
    size: '3.1 MB',
    date: '2024-11-01'
  },
  {
    id: '6',
    title: 'Architecture Cloud - Slides',
    description: 'Présentation complète sur les architectures cloud modernes',
    type: 'presentation',
    category: 'Cloud & DevOps',
    size: '4.5 MB',
    date: '2024-10-28'
  },
  {
    id: '7',
    title: 'Guide de sécurité web',
    description: 'Best practices pour sécuriser vos applications',
    type: 'pdf',
    category: 'Cybersecurity',
    size: '2.1 MB',
    date: '2024-10-25'
  },
  {
    id: '8',
    title: 'Projet Mobile - Starter Kit',
    description: 'Code de démarrage pour votre projet React Native',
    type: 'code',
    category: 'Mobile Development',
    size: '6.2 MB',
    date: '2024-10-20'
  }
];

const getIconForType = (type: Document['type']) => {
  switch (type) {
    case 'pdf':
      return FileText;
    case 'code':
      return FileCode;
    case 'excel':
      return FileSpreadsheet;
    case 'presentation':
      return Presentation;
  }
};

const getColorForType = (type: Document['type']) => {
  switch (type) {
    case 'pdf':
      return 'text-red-400';
    case 'code':
      return 'text-green-400';
    case 'excel':
      return 'text-emerald-400';
    case 'presentation':
      return 'text-orange-400';
  }
};

export function Documents() {
  const handleDownload = (doc: Document) => {
    toast.success(`Téléchargement de "${doc.title}" commencé`);
  };

  return (
    <div className="bg-zinc-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="mb-4 text-zinc-50">Documents à télécharger</h2>
          <p className="text-zinc-400 max-w-2xl">
            Accédez à tous les documents, ressources et supports de cours nécessaires pour votre apprentissage
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => {
            const Icon = getIconForType(doc.type);
            const iconColor = getColorForType(doc.type);

            return (
              <div
                key={doc.id}
                className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className={`rounded-lg bg-zinc-800 p-3 ${iconColor}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                    {doc.size}
                  </Badge>
                </div>

                <h3 className="mb-2 text-zinc-50">{doc.title}</h3>
                <p className="mb-4 text-sm text-zinc-400 line-clamp-2">
                  {doc.description}
                </p>

                <div className="mb-4 flex items-center gap-2">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                    {doc.category}
                  </Badge>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(doc.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <Button
                    onClick={() => handleDownload(doc)}
                    size="sm"
                    className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-xl border border-zinc-800 bg-gradient-to-br from-blue-500/10 to-violet-500/10 p-8 backdrop-blur-sm">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
            <div className="mb-4 rounded-full bg-blue-500/20 p-4 sm:mb-0 sm:mr-6">
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-zinc-50">Besoin d'un document spécifique?</h3>
              <p className="text-zinc-400">
                Si vous ne trouvez pas le document que vous recherchez, contactez votre conseiller
              </p>
            </div>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white border-0 sm:mt-0">
              Contacter un conseiller
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
