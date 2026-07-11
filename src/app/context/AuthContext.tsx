import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_TOKEN_KEY = "bethel-admin-token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Session expiree");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = useCallback(async (email: string, password: string, remember?: boolean) => {
    let res: Response;
    try {
      res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, remember: remember ?? false }),
      });
    } catch {
      throw new Error("Impossible de contacter le serveur");
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Erreur de connexion" }));
      throw new Error(err.message || "Identifiants invalides");
    }
    const data = await res.json();
    if (!data.token) throw new Error("Reponse invalide du serveur");
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await fetch("/api/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` }, credentials: "include" });
      } catch {}
    }
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit etre utilise dans AuthProvider");
  return ctx;
}
