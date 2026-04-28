import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SnackInfo from "../../../components/snack-info/SnackInfo";
import api from "../../../api/axios";

type TEmpresa = {
  id?: number;
  entidade?: number;
  cnpj: string;
  nomeFantasia: string;
  nomeSocial: string; // 👈 adicionar
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
  } = useForm<TEmpresa>({
    defaultValues: {
      cnpj: "",
      nomeFantasia: "",
      nomeSocial: "",
      cep: "",
      endereco: "",
      cidade: "",
      uf: "",
    },
  });

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateEmpresa = location.state as TEmpresa | undefined;

  const [empresaOriginal, setEmpresaOriginal] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackType, setSnackType] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const showSnack = (message: string, type: any = "success") => {
    setSnackMessage(message);
    setSnackType(type);
    setSnackOpen(true);
  };

  useEffect(() => {
    const carregarEmpresa = async () => {
      try {
        setLoading(true);

        if (stateEmpresa) {
          reset({
            cnpj: stateEmpresa?.cnpj || "",
            nomeFantasia: stateEmpresa?.nomeFantasia || "",
            nomeSocial: stateEmpresa?.nomeSocial || "",
            cep: stateEmpresa?.cep || "",
            endereco: stateEmpresa?.endereco || "",
            cidade: stateEmpresa?.cidade || "",
            uf: stateEmpresa?.uf || "",
          });
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
        showSnack("Erro ao carregar empresa", "error");
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
          nomeFantasia: data.nomeFantasia,

          nomeSocial: empresaOriginal.nomeSocial || data.nomeFantasia,
        };

        await api.put(`/api/v1/pessoa_juridica/${id}`, payload);
        showSnack("Empresa atualizada com sucesso!", "success");
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
        showSnack("Empresa criada com sucesso!", "success");
      }

      setTimeout(() => navigate("/empresas"), 2000);
    } catch (err) {
      showSnack("Erro ao salvar empresa", "error");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={0.5} color="text.primary">
        {id ? "Editar Empresa" : "Cadastro de Empresa"}
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Preencha as informações abaixo.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight={600}>
              Dados da Empresa
            </Typography>

            {/* LINHA 1 */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="CNPJ"
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
              />
              <TextField
                fullWidth
                label="Nome Empresa"
                {...register("nomeSocial", {
                  onChange: (e) =>
                    (e.target.value = e.target.value.toUpperCase()),
                })}
              />
              <TextField
                fullWidth
                label="Nome Fantasia"
                {...register("nomeFantasia", {
                  required: "Nome é obrigatório",
                  onChange: (e) =>
                    (e.target.value = e.target.value.toUpperCase()),
                })}
                error={!!errors.nomeFantasia}
                helperText={errors.nomeFantasia?.message}
              />
            </Stack>

            {/* ENDEREÇO */}
            <TextField
              fullWidth
              label="Endereço"
              {...register("endereco", {
                onChange: (e) =>
                  (e.target.value = e.target.value.toUpperCase()),
              })}
            />

            {/* LINHA 3 */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Cidade"
                {...register("cidade", {
                  onChange: (e) =>
                    (e.target.value = e.target.value.toUpperCase()),
                })}
              />

              <TextField
                label="UF"
                sx={{ width: { xs: "100%", md: 100 } }}
                {...register("uf", {
                  onChange: (e) =>
                    (e.target.value = e.target.value.toUpperCase()),
                })}
              />

              <TextField fullWidth label="CEP" {...register("cep")} />
            </Stack>

            {/* BOTÕES */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={() => navigate("/empresas")}>
                Cancelar
              </Button>

              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={{ bgcolor: "#5c6cff" }}
              >
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>

      <SnackInfo
        open={snackOpen}
        message={snackMessage}
        type={snackType}
        onClose={() => setSnackOpen(false)}
      />
    </Box>
  );
}
