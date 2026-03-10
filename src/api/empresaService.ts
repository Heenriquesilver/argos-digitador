import api from "./axios";

export const empresaService = {
  createEmpresa: async (data: any) => {
    const payload = {
      cnpj: data.cnpj.replace(/\D/g, ""),
      linkLogomarca: null,
      cep: data.cep,
      endereco: data.endereco,
      cidade: data.cidade,
      uf: data.uf,
      gps: "0.00",
      fundacao: "1900-01-01",
      razaoSocial: data.nomeFantasia,
      nomeFantasia: data.nomeFantasia,
      nomeSocial: data.nomeFantasia,
    };

    const response = await api.post("/api/v1/pessoa_juridica", payload);
    return response.data;
  },

  updateEmpresa: async (id: number, data: any) => {
    const payload = {
      entidade: {
        id: data.entidade,
      },
      cnpj: data.cnpj.replace(/\D/g, ""),
      linkLogomarca: data.linkLogomarca || null,
      cep: data.cep,
      endereco: data.endereco,
      cidade: data.cidade,
      uf: data.uf,
      gps: data.gps || "0.00",
      fundacao: data.fundacao || "1900-01-01",
      razaoSocial: data.nomeFantasia,
      nomeFantasia: data.nomeFantasia,
      nomeSocial: data.nomeFantasia,
    };

    console.log(" Payload ", payload);

    const response = await api.put(`/api/v1/pessoa_juridica/${id}`, payload);
    return response.data;
  },
};
