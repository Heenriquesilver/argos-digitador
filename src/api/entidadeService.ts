import api from "./axios";

export const entidadeService = {
  async getUserWorkingEntity() {
    try {
      const entidadeId = localStorage.getItem("idEntidadeUsuarioLogado");
      const token = localStorage.getItem("accessToken");

      if (!entidadeId || !token) {
        throw new Error("Usuário não autenticado");
      }

      const response = await api.get(`/api/v1/conexao_social/tipo_conexao`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          tipo_conexao: 6,
          entidade: entidadeId,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar entidade do usuário:", error);
      throw error;
    }
  },
};
