import { Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Link to="/" className="flex items-center gap-2 cursor-pointer">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 p-2">
                  <Code2 className="h-5 w-5" />
                </div>
                <span className="font-mono text-zinc-50">DevAcademy</span>
              </Link>
            </div>
            <p className="text-sm text-zinc-400">
              La plateforme de formation pour développeurs. Apprenez, pratiquez, excellez.
            </p>
            
            {/* Les réseaux sociaux restent des liens externes <a> */}
            <div className="mt-4 flex gap-2">
              <a
                href="#"
                className="rounded-lg bg-zinc-900 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Github"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-lg bg-zinc-900 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-lg bg-zinc-900 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@devacademy.fr"
                className="rounded-lg bg-zinc-900 p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Programmes */}
          <div>
            <h4 className="mb-4 text-zinc-50">Programmes</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              {/* Note: Idéalement, ces liens devraient inclure un paramètre d'URL 
                  (ex: /programmes?cat=web) pour filtrer automatiquement.
                  Pour l'instant, ils redirigent vers la page principale des programmes.
              */}
              <li>
                <Link to="/programmes" className="hover:text-zinc-100 transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/programmes" className="hover:text-zinc-100 transition-colors">
                  Data Science
                </Link>
              </li>
              <li>
                <Link to="/programmes" className="hover:text-zinc-100 transition-colors">
                  Mobile Development
                </Link>
              </li>
              <li>
                <Link to="/programmes" className="hover:text-zinc-100 transition-colors">
                  Cloud & DevOps
                </Link>
              </li>
              <li>
                <Link to="/programmes" className="hover:text-zinc-100 transition-colors">
                  Cybersecurity
                </Link>
              </li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="mb-4 text-zinc-50">Entreprise</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              {/* Ces pages n'existent pas encore, on laisse des ancres vides ou on redirige vers l'accueil/contact */}
           <li><Link to="/a-propos" className="hover:text-zinc-100 transition-colors">À propos</Link></li>
  <li><Link to="/equipe" className="hover:text-zinc-100 transition-colors">Notre équipe</Link></li>
  <li><Link to="/carrieres" className="hover:text-zinc-100 transition-colors">Carrières</Link></li>
  <li><Link to="/partenaires" className="hover:text-zinc-100 transition-colors">Partenaires</Link></li>
  <li><Link to="/blog" className="hover:text-zinc-100 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-zinc-50">Support</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <Link to="/faq" className="hover:text-zinc-100 transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <a href="/faq" className="hover:text-zinc-100 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-zinc-100 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="/cgu" className="hover:text-zinc-100 transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="/confidentialite" className="hover:text-zinc-100 transition-colors">
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