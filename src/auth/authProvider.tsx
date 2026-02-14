import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./authContext";
import api from "../api/axios";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  async function handleAuth(url: string, email: string, credential: string) {
    try {
      const res = await api.post(url, { email, credential });

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);
    } catch (err: any) {
      console.error("Erro ao logar:", err.response?.data || err);
      throw err;
    }
  }

  const loginPassword = (email: string, credential: string) =>
    handleAuth("/auth/login", email, credential);

  const loginCode = (email: string, credential: string) =>
    handleAuth("/auth/login/code", email, credential);

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginPassword, loginCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
