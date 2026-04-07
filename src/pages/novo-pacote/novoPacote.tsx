import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { useAuth } from "../../auth/useAuth";
import useGetEntidadeWork from "../../api/hooks/useGetEntidadeWork";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function NovoPacotePage() {
  const navigate = useNavigate();
  const { data: idEntidadeWork } = useGetEntidadeWork();
  const { user } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [prazo, setPrazo] = useState("");

  const [observacao, setObservacao] = useState("");
  const [prioridade, setPrioridade] = useState("NORMAL");
  const [valor, setValor] = useState("");

  const entidade = idEntidadeWork;
  const responsavel = localStorage.getItem("idEntidadeUsuarioLogado");

  function formatarDataHoje() {
    const hoje = new Date();

    return hoje.toLocaleDateString("pt-BR");
  }

  const nomeUsuario = user?.pessoaFisica.nome;

  const tituloFinal = `${titulo} - ${nomeUsuario} - ${formatarDataHoje()}`;

  function formatarMoeda(value: string) {
    const numero = value.replace(/\D/g, "");

    const numeroFormatado = (Number(numero) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return numeroFormatado;
  }

  function converterValorParaNumero(valor: string) {
    return Number(valor.replace(/\D/g, "")) / 100;
  }

  function getPrioridadeValue(value: string) {
    switch (value) {
      case "NORMAL":
        return 1;
      case "ALTA":
        return 2;
      case "URGENTE":
        return 3;
      default:
        return 1;
    }
  }

  async function salvarPacote() {
    if (!titulo) {
      alert("Preencha os campos obrigatórios");
      return;
    }

    if (!entidade) {
      alert("Entidade não carregada ainda");
      return;
    }

    if (!responsavel) {
      alert("Responsável não encontrado");
      return;
    }

    const payload = {
      entidade: Number(entidade),
      titulo: tituloFinal,
      prioridade: getPrioridadeValue(prioridade),
      status: 1,
      valor: converterValorParaNumero(valor),
      responsavel: Number(responsavel),
      // alocacao: new Date().toISOString(),
      // inicio: "formatToISO(inicio)",
      // termino: formatToISO(termino),
      prazo,
      observacao,
    };

    try {
      await api.post("/api/v1/pacote-calculo", payload);

      alert("Pacote criado com sucesso!");
      navigate(-1);
    } catch (error: any) {
      console.error("Erro completo:", error?.response?.data || error);

      const mensagem =
        error?.response?.data?.message ||
        "Erro ao criar pacote. Verifique os dados.";

      alert(mensagem);
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={0.5} color="text.primary">
        Criar Pacote
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Preencha as informações abaixo para criar um pacote.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={600}>
            Dados do Pacote
          </Typography>

          <Stack direction={"row"} gap={2}>
            <TextField
              fullWidth
              label="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            {/* <TextField
              fullWidth
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(Number(e.target.value))}
            >
              <MenuItem value={1}>A iniciar</MenuItem>
              <MenuItem value={2}>Em execução</MenuItem>
              <MenuItem value={3}>Finalizado</MenuItem>
            </TextField> */}
          </Stack>

          <Stack direction={"row"} gap={2}>
            {/* <TextField
              fullWidth
              label="Início"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label="Término"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              required
            /> */}
            <Stack direction={"row"} gap={2}>
              <TextField
                label="Valor"
                value={valor}
                onChange={(e) => {
                  const valorFormatado = formatarMoeda(e.target.value);
                  setValor(valorFormatado);
                }}
                sx={{ width: 300 }}
              />

              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DatePicker
                  label="Prazo"
                  value={prazo ? dayjs(prazo) : null}
                  onChange={(newValue) =>
                    setPrazo(newValue ? newValue.format("YYYY-MM-DD") : "")
                  }
                  sx={{ width: 300 }}
                />
              </LocalizationProvider>
            </Stack>
            <FormControl>
              <FormLabel sx={{ color: "#5c6cff" }}>Prioridade</FormLabel>
              <RadioGroup
                row
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
              >
                <FormControlLabel
                  value="NORMAL"
                  control={<Radio />}
                  label="NORMAL"
                />
                <FormControlLabel
                  value="ALTA"
                  control={<Radio />}
                  label="ALTA"
                />
                <FormControlLabel
                  value="URGENTE"
                  control={<Radio />}
                  label="URGENTE"
                />
              </RadioGroup>
            </FormControl>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Observação"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff" }}
              onClick={salvarPacote}
            >
              Salvar
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
