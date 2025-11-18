import { Code2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/programmes', label: 'Programmes' },
    { path: '/inscription', label: 'Inscription' },
    { path: '/contact', label: 'Contact' },
  ];

  const getLinkClass = ({ isActive }: { isActive: boolean }) => 
    `px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-zinc-800 text-zinc-50'
        : 'text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900'
    }`;

  const getMobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block w-full px-4 py-3 text-left rounded-lg transition-colors ${
      isActive
        ? 'bg-zinc-800 text-zinc-50'
        : 'text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 p-2">
              <Code2 className="h-6 w-6" />
            </div>
            <span className="font-mono">DevAcademy</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={getLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-zinc-800 py-4 md:hidden">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={getMobileLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}