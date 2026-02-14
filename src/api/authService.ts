import api from "./axios";

interface LoginPayload {
  email: string;
  credential: string;
}

const saveAuth = (data: any) => {
  localStorage.setItem("accessToken", data.access_token);
  localStorage.setItem("refreshToken", data.refresh_token);
  localStorage.setItem("usuario", data.user.person.name);
  localStorage.setItem("userRole", data.user.role);

  window.dispatchEvent(new Event("storage"));
};

export const authService = {
  loginWithPassword: async (data: LoginPayload) => {
    const res = await api.post("/api/v1/auth/login", data);
    saveAuth(res.data);
  },

  loginWithCode: async (data: LoginPayload) => {
    const res = await api.post("/api/v1/auth/login/code", data);
    saveAuth(res.data);
  },

  logout: () => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
  },
};
