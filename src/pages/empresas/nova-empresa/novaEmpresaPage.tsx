// src/pages/empresas/NovaEmpresaPage.tsx
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../api/axios";

type TEmpresa = {
  id?: number;
  entidade?: number;
  cnpj: string;
  nomeFantasia: string;
  cep: string;
  endereco: string;
  cidade: string;
  uf: string;
};

export default function NovaEmpresaPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TEmpresa>();

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateEmpresa = location.state as TEmpresa | undefined;
  const [empresaOriginal, setEmpresaOriginal] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const voltarEmpresasPage = () => navigate("/empresas");

  useEffect(() => {
    const carregarEmpresa = async () => {
      try {
        setLoading(true);

        if (stateEmpresa) {
          reset(stateEmpresa);
          setEmpresaOriginal(stateEmpresa);
        } else if (id) {
          const response = await api.get(`/api/v1/pessoa_juridica/${id}`);
          const empresa = response.data;
          reset({
            id: empresa.id,
            cnpj: empresa.cnpj || "",
            nomeFantasia: empresa.nomeFantasia || "",
            cep: empresa.cep || "",
            endereco: empresa.endereco || "",
            cidade: empresa.cidade || "",
            uf: empresa.uf || "",
          });
          setEmpresaOriginal(empresa);
        }
      } catch (err) {
        console.error("Erro ao carregar empresa", err);
        alert("Erro ao carregar empresa.");
      } finally {
        setLoading(false);
      }
    };

    carregarEmpresa();
  }, [id, stateEmpresa, reset]);

  const onSubmit = async (data: TEmpresa) => {
    try {
      if (id && empresaOriginal) {
        const payload = {
          cnpj: data.cnpj || empresaOriginal.cnpj,
          linkLogomarca: empresaOriginal.linkLogomarca ?? null,
          cep: data.cep || empresaOriginal.cep,
          endereco: data.endereco || empresaOriginal.endereco,
          cidade: data.cidade || empresaOriginal.cidade,
          uf: data.uf || empresaOriginal.uf,
          gps: empresaOriginal.gps ?? "0.00",
          fundacao: empresaOriginal.fundacao ?? "1900-01-01",
          razaoSocial: data.nomeFantasia || empresaOriginal.razaoSocial,
          nomeFantasia: data.nomeFantasia || empresaOriginal.nomeFantasia,
          nomeSocial: empresaOriginal.nomeSocial || data.nomeFantasia,
        };

        await api.put(`/api/v1/pessoa_juridica/${id}`, payload);
        alert("Empresa atualizada com sucesso!");
      } else {
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
        await api.post("/api/v1/pessoa_juridica", payload);
        alert("Empresa criada com sucesso!");
      }

      navigate("/empresas");
    } catch (err) {
      console.error("Erro ao salvar empresa", err);
      alert("Erro ao salvar empresa.");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        width: "100%",
        p: 3,
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h5" fontWeight={600} color="text.primary">
        {id ? "Editar Empresa" : "Nova Empresa"}
      </Typography>

      <Paper
        sx={{
          p: 5,
          width: "100%",
          maxWidth: "80vw",
          display: "flex",
          borderRadius: 3,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            {/* LINHA 1 */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* CNPJ - 1/3 */}
              <TextField
                label="CNPJ"
                InputLabelProps={{ shrink: true }}
                {...register("cnpj", {
                  required: "CNPJ é obrigatório",
                  onChange: (e) => {
                    let v = e.target.value.replace(/\D/g, "");
                    if (v.length > 14) v = v.slice(0, 14);
                    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
                    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
                    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
                    v = v.replace(/(\d{4})(\d)/, "$1-$2");
                    e.target.value = v;
                  },
                })}
                error={!!errors.cnpj}
                helperText={errors.cnpj?.message}
                sx={{
                  flex: 1,
                  "& .MuiInputBase-root": {
                    backgroundColor: "#F6F7F8",
                  },
                }}
              />

              {/* Empresa - 2/3 */}
              <TextField
                label="Nome Empresa"
                InputLabelProps={{ shrink: true }}
                {...register("nomeFantasia", {
                  required: "Nome da empresa é obrigatório",
                })}
                error={!!errors.nomeFantasia}
                helperText={errors.nomeFantasia?.message}
                sx={{
                  flex: 2,
                  "& .MuiInputBase-root": {
                    backgroundColor: "#F6F7F8",
                  },
                }}
              />
            </Box>

            {/* LINHA 2 */}
            <TextField
              label="Endereço"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("endereco")}
              sx={{
                "& .MuiInputBase-root": {
                  backgroundColor: "#F6F7F8",
                },
              }}
            />

            {/* LINHA 3 */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Cidade */}
              <TextField
                label="Cidade"
                InputLabelProps={{ shrink: true }}
                {...register("cidade")}
                sx={{
                  flex: 1.5,
                  "& .MuiInputBase-root": {
                    backgroundColor: "#F6F7F8",
                  },
                }}
              />

              {/* UF - 1/4 */}
              <TextField
                label="UF"
                InputLabelProps={{ shrink: true }}
                {...register("uf")}
                sx={{
                  flex: 0.5,
                  "& .MuiInputBase-root": {
                    backgroundColor: "#F6F7F8",
                  },
                }}
              />

              {/* CEP */}
              <TextField
                label="CEP"
                InputLabelProps={{ shrink: true }}
                {...register("cep")}
                sx={{
                  flex: 1,
                  "& .MuiInputBase-root": {
                    backgroundColor: "#F6F7F8",
                  },
                }}
              />
            </Box>
          </Box>
          {/* Botões */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" onClick={voltarEmpresasPage}>
              Voltar
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{
                bgcolor: "#5c6cff",
                "&:hover": { backgroundColor: "#3ea2d4ff" },
              }}
            >
              {isSubmitting ? "Salvando..." : "Salvar Empresa"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
