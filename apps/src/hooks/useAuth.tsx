import { useState, useEffect, useCallback } from 'react';

interface User {
  user_id: string;
  email: string;
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift();
}


export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:9090/api/auth/me', {
        method: 'GET',
        credentials: "include"
      });

      if (response.ok) {
        const user = await response.json();
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  }, []);
  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-changed', handleAuthChange);
    return () => window.removeEventListener('auth-changed', handleAuthChange);
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
      window.dispatchEvent(new Event('auth-changed'));
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  return {
    ...authState,
    checkAuth,
    logout,
  };
}
