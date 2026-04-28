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
    return saved && saved !== "undefined" ? JSON.parse(saved) : null;
  });

  async function handleAuth(url: string, email: string, senha: string) {
    try {
      const res = await api.post(url, { email, senha });

      if (!res.data.authenticated) {
        throw new Error(res.data.accessToken || "Usuário Inválido");
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("IdEntidadePai", res.data.usuario.id);
      localStorage.setItem(
        "idPessoaFisicaLogada",
        res.data.usuario.pessoaFisica.id,
      );
      localStorage.setItem(
        "idEntidadeUsuarioLogado",
        res.data.usuario.pessoaFisica.entidade.id,
      );

      localStorage.setItem("user", JSON.stringify(res.data.usuario));
      localStorage.setItem(
        "usuario",
        res.data.usuario?.pessoaFisica?.nome || "Usuário",
      );
      localStorage.setItem(
        "userRole",
        JSON.stringify(res.data.usuario?.permissoes || []),
      );

      setUser(res.data.usuario);
    } catch (err: any) {
      console.error("Erro ao logar:", err.response?.data || err);
      throw err;
    }
  }

  const loginPassword = (email: string, senha: string) =>
    handleAuth("/auth/login", email, senha);

  const loginCode = (email: string, senha: string) =>
    handleAuth("/auth/login/code", email, senha);

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
