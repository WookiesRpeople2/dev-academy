import { Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 p-2">
                <Code2 className="h-5 w-5" />
              </div>
              <span className="font-mono text-zinc-50">DevAcademy</span>
            </div>
            <p className="text-sm text-zinc-400">
              La plateforme de formation pour développeurs. Apprenez, pratiquez, excellez.
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href="#"
                className="rounded-lg bg-zinc-900 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-lg bg-zinc-900 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-lg bg-zinc-900 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-lg bg-zinc-900 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="mb-4 text-zinc-50">Programmes</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Web Development
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Data Science
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Mobile Development
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Cloud & DevOps
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Cybersecurity
                </a>
              </li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="mb-4 text-zinc-50">Entreprise</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Notre équipe
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Carrières
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Partenaires
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-zinc-50">Support</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-zinc-100 transition-colors">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-800 pt-8 text-center text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} DevAcademy. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
