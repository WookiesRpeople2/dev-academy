import { Download } from 'lucide-react';
import { Button } from './ui/button';

interface CourseDocumentsProps {
  documents: string[]; // list of document URLs
}

export function CourseDocuments({ documents }: CourseDocumentsProps) {
  if (!documents || documents.length === 0) return null;

  return (
    <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 backdrop-blur-sm">
      <h3 className="mb-2 text-zinc-50">Documents du cours</h3>
      <p className="mb-4 text-sm text-zinc-400">
        Téléchargez les documents pour suivre et réviser le cours.
      </p>
      <div className="flex flex-col gap-2">
        {documents.map((doc, index) => {
          const fileName = doc.split('/').pop() ?? `Document ${index + 1}`;
          return (
            <a
              key={index}
              href={`http://localhost:4566/${doc}`} download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-0">
                <Download className="mr-2 h-4 w-4" />
                {fileName}
              </Button>
            </a>
          );
        })}
      </div>
    </div>
  );
}

