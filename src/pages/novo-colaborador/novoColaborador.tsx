import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import SnackInfo from "../../components/snack-info/SnackInfo";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useGetEntidadeWork from "../../api/hooks/useGetEntidadeWork";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import api from "../../api/axios";

export default function NovoColaboradorPage() {
  const navigate = useNavigate();

  const { data: idEntidadeWork } = useGetEntidadeWork();

  const { id } = useParams();
  const isEdit = !!id;

  dayjs.locale("pt-br");

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [dtNascto, setDtNascto] = useState("");
  const [entidadeOriginal, setEntidadeOriginal] = useState<number | null>(null);
  const [idColaborador, setIdColaborador] = useState<number | null>(null);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackType, setSnackType] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const showSnack = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setSnackMessage(message);
    setSnackType(type);
    setSnackOpen(true);
  };

  function maskCPF(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function maskTelefone(value: string) {
    return value
      .replace(/\D/g, "")
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  useEffect(() => {
    async function carregarDados() {
      if (!id) return;

      try {
        const response = await api.get(`/api/v1/pessoa_fisica/${id}`);
        const data = response.data;

        setNome(data.nome);
        setCpf(data.cpf);
        setTelefone(data.telefone);
        setDtNascto(data.dtNascto);
        setEntidadeOriginal(data.entidade?.id);
        setIdColaborador(data.id);
      } catch (error) {
        console.error("Erro ao carregar colaborador", error);
        showSnack("Erro ao carregar colaborador", "error");
      }
    }

    carregarDados();
  }, [id]);

  async function salvarColaborador() {
    try {
      if (!nome || !cpf || !telefone || !dtNascto) {
        showSnack("Preencha todos os campos obrigatórios", "warning");
        return;
      }

      const payload = {
        entidade: 0,
        nome,
        cpf,
        telefone,
        dtNascto,
      };
      const payloadEditar = {
        entidade: Number(entidadeOriginal),
        nome,
        cpf,
        telefone,
        dtNascto,
      };

      if (isEdit) {
        await api.put(`/api/v1/pessoa_fisica/${id}`, payloadEditar);

        showSnack("Colaborador atualizado com sucesso!", "success");
      } else {
        const response = await api.post("/api/v1/pessoa_fisica", payload);

        const idEntidadePessoaFisica = response.data.entidade?.id;

        if (!idEntidadePessoaFisica) {
          throw new Error("ID não retornado na criação do colaborador");
        }

        await api.post("/api/v1/conexao_social", {
          entidadePai: Number(idEntidadeWork),
          entidadeFilha: idEntidadePessoaFisica,
          tipoConexaoSocial: 6,
          ativo: 1,
        });

        showSnack("Colaborador cadastrado com sucesso!", "success");
      }

      setTimeout(() => {
        navigate("/colaboradores");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar colaborador", error);
      showSnack("Erro ao salvar colaborador", "error");
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={0.5} color="text.primary">
        {isEdit ? "Editar Colaborador" : "Cadastro de Colaborador"}
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Preencha as informações abaixo para cadastrar um novo colaborador.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={600}>
            Dados do Colaborador
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {isEdit ? (
              <TextField
                label="ID"
                value={idColaborador ?? ""}
                InputProps={{ readOnly: true }}
                sx={{ width: 200 }}
              />
            ) : (
              ""
            )}

            <TextField
              fullWidth
              label="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="CPF"
              value={cpf}
              onChange={(e) => setCpf(maskCPF(e.target.value))}
              required
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(maskTelefone(e.target.value))}
              required
              sx={{ width: 500 }}
            />
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
            >
              <DatePicker
                label="Data de Nascimento"
                format="DD/MM/YYYY"
                value={dtNascto ? dayjs(dtNascto) : null}
                onChange={(newValue: any) =>
                  setDtNascto(newValue ? newValue.format("YYYY-MM-DD") : "")
                }
                sx={{ width: 300 }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Stack>

          {/* BOTÕES */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff" }}
              onClick={salvarColaborador}
            >
              Salvar
            </Button>
          </Stack>
        </Stack>
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
