import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

function getStoredToken() {
  return localStorage.getItem("access") || sessionStorage.getItem("access");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    }
  }, []);

  const login = async (username, password, remember) => {
    const res = await api.post("auth/token/", {
      username,
      password,
    });

    const storage = remember ? localStorage : sessionStorage;

    storage.setItem("access", res.data.access);
    storage.setItem("refresh", res.data.refresh);

    try {
      const payload = JSON.parse(atob(res.data.access.split(".")[1]));
      setUser(payload);
    } catch {
      logout();
    }
  };

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
