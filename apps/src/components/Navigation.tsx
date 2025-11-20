import { Code2, Menu, X, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );
  useEffect(() => {
    const onAuthChanged = () =>
      setIsAuthenticated(localStorage.getItem("auth") === "true");
    window.addEventListener("auth-changed", onAuthChanged as EventListener);
    window.addEventListener("storage", onAuthChanged as EventListener);
    return () => {
      window.removeEventListener(
        "auth-changed",
        onAuthChanged as EventListener
      );
      window.removeEventListener("storage", onAuthChanged as EventListener);
    };
  }, []);
  const logout = () => {
    localStorage.setItem("auth", "false");
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("auth-changed"));
  };

  const navItems = [
    { path: "/", label: "Accueil" },
    { path: "/programmes", label: "Programmes" },
    { path: "/inscription", label: "Inscription" },
    { path: "/contact", label: "Contact" },
    { path: "/ide", label: "IDE" },
  ];

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? "bg-zinc-800 text-zinc-50"
        : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900"
    }`;

  const getMobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block w-full px-4 py-3 text-left rounded-lg transition-colors ${
      isActive
        ? "bg-zinc-800 text-zinc-50"
        : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900"
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
              <NavLink key={item.path} to={item.path} className={getLinkClass}>
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <Button onClick={logout} className="ml-2" variant="outline">
                <LogOut className="mr-2 h-4 w-4" /> Se déconnecter
              </Button>
            ) : (
              <Button onClick={() => navigate("/connexion")} className="ml-2">
                <LogIn className="mr-2 h-4 w-4" /> Se connecter
              </Button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
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
            <div className="mt-2 flex gap-2">
              {isAuthenticated ? (
                <Button onClick={logout} variant="outline" className="flex-1">
                  <LogOut className="mr-2 h-4 w-4" /> Se déconnecter
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/connexion");
                  }}
                  className="flex-1"
                >
                  <LogIn className="mr-2 h-4 w-4" /> Se connecter
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
