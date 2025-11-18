import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

export function Careers() {
  const jobs = [
    {
      title: 'Senior React Developer',
      department: 'Engineering',
      location: 'Paris (Remote)',
      type: 'CDI',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Freelance',
    },
    {
      title: 'Student Success Manager',
      department: 'Support',
      location: 'Lyon',
      type: 'CDI',
    }
  ];

  return (
    <div className="bg-zinc-950 py-16 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-zinc-50 mb-4">Rejoignez l'aventure</h1>
          <p className="text-zinc-400">
            Nous cherchons des talents passionnés pour révolutionner l'éducation tech.
          </p>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.title} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 transition-all cursor-pointer">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold text-zinc-50 group-hover:text-blue-400 transition-colors">{job.title}</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-zinc-400">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {job.department}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.type}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-blue-500">
                Postuler <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}