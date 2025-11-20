import { createContext, useContext, type ReactNode } from "react";
import { useAuth as useServerAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";


interface AuthContextValue {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode; }) {
  const auth = useServerAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
}




export function RequireAuth({ children }: { children: React.ReactNode; }) {
  const { isAuthenticated, loading } = useServerAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center pt-20">Chargement…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

