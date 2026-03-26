import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import useGetEntidadeWork from "../../api/hooks/useGetEntidadeWork";
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
      }
    }

    carregarDados();
  }, [id]);

  async function salvarColaborador() {
    try {
      if (!nome || !cpf || !telefone || !dtNascto) {
        alert("Preencha todos os campos obrigatórios");
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

        alert("Colaborador atualizado com sucesso!");
      } else {
        await api.post("/api/v1/pessoa_fisica", payload);

        alert("Colaborador cadastrado com sucesso!");
      }

      navigate(-1);
    } catch (error) {
      console.error("Erro ao salvar colaborador", error);
      alert("Erro ao salvar colaborador");
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
            <TextField
              label="ID"
              value={idColaborador ?? ""}
              InputProps={{ readOnly: true }}
              sx={{ width: 200 }}
            />

            <TextField
              fullWidth
              label="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
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
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
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
                onChange={(newValue) =>
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
    </Box>
  );
}
