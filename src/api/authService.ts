import api from "./axios";

interface LoginPayload {
  email: string;
  senha: string; // será usado como senha
}

const saveAuth = (data: any) => {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("user", JSON.stringify(data.usuario));
  localStorage.setItem(
    "usuario",
    data.usuario?.pessoaFisica?.nome || "Usuário",
  );
  localStorage.setItem(
    "userRole",
    JSON.stringify(data.usuario?.permissoes || []),
  );
  window.dispatchEvent(new Event("storage"));
};

export const authService = {
  loginWithPassword: async (data: LoginPayload) => {
    const res = await api.post("/auth/login", {
      email: data.email,
      senha: data.senha,
    });

    if (!res.data.authenticated) {
      throw new Error(res.data.accessToken || "Usuário Inválido");
    }

    saveAuth(res.data);
  },

  loginWithCode: async (data: LoginPayload) => {
    const res = await api.post("/auth/login/code", {
      email: data.email,
      senha: data.senha,
    });

    if (!res.data.authenticated) {
      throw new Error(res.data.accessToken || "Código inválido");
    }

    saveAuth(res.data);
  },

  logout: () => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
  },
};
