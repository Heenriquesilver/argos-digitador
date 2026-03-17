import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Stack,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormControl,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import Radio from "@mui/material/Radio";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

type Tprioridade = "NORMAL" | "ALTA" | "URGENTE";

export default function NovoProcessoPage() {
  const navigate = useNavigate();

  dayjs.locale("pt-br");

  const [prioridade, setPrioridade] = useState<Tprioridade>("NORMAL");

  const [clienteBusca, setClienteBusca] = useState("");
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);

  const [fasesProcesso, setFasesProcesso] = useState<any[]>([]);
  const [faseSelecionada, setFaseSelecionada] = useState("");

  const [assuntosJuridicos, setAssuntosJuridicos] = useState<any[]>([]);
  const [assuntoSelecionado, setAssuntoSelecionado] = useState("");

  const [tribunalBusca, setTribunalBusca] = useState("");
  const [tribunais, setTribunais] = useState<any[]>([]);
  const [tribunalSelecionado, setTribunalSelecionado] = useState<any>(null);
  const [numeroProcesso, setNumeroProcesso] = useState("");
  const [reclamante, setReclamante] = useState("");
  const [reclamada, setReclamada] = useState("");
  const [prazoFatal, setPrazoFatal] = useState("");
  const [observacao, setObservacao] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setPrioridade(event.target.value as Tprioridade);
  };

  const controlProps = (item: Tprioridade) => ({
    checked: prioridade === item,
    onChange: handleChange,
    value: item,
    name: "prioridade-radio",
  });

  async function buscarCliente() {
    try {
      const res = await api.get("/api/v1/pessoa_juridica/nome", {
        params: {
          nome: clienteBusca,
          page: 0,
          size: 10,
        },
      });

      setClientes(res.data.elements);
    } catch (error) {
      console.error("Erro ao buscar cliente", error);
    }
  }

  async function buscarTribunal() {
    try {
      const res = await api.get("/api/v1/pessoa_juridica/nome", {
        params: {
          nome: tribunalBusca,
          page: 0,
          size: 10,
        },
      });

      setTribunais(res.data.elements);
    } catch (error) {
      console.error("Erro ao buscar tribunal", error);
    }
  }

  function selecionarCliente(cliente: any) {
    setClienteSelecionado(cliente);
    setClienteBusca(cliente.entidade.nomeSocial);
    setClientes([]);
  }

  function selecionarTribunal(tribunal: any) {
    setTribunalSelecionado(tribunal);
    setTribunalBusca(tribunal.entidade.nomeSocial);
    setTribunais([]);
  }

  useEffect(() => {
    async function carregarFasesProcesso() {
      try {
        const res = await api.get("/api/v1/fase-processo", {
          params: {
            page: 0,
            size: 10,
          },
        });

        setFasesProcesso(res.data.elements);
      } catch (error) {
        console.error("Erro ao carregar fases do processo", error);
      }
    }

    async function carregarAssuntosJuridicos() {
      try {
        const res = await api.get("/api/v1/assunto-juridico", {
          params: {
            page: 0,
            size: 10,
          },
        });

        setAssuntosJuridicos(res.data.elements);
      } catch (error) {
        console.error("Erro ao carregar assuntos jurídicos", error);
      }
    }

    carregarFasesProcesso();
    carregarAssuntosJuridicos();
  }, []);

  async function salvarProcesso() {
    try {
      const entidadePai = localStorage.getItem("idEntidadeUsuarioLogado");

      if (!clienteSelecionado) {
        alert("Selecione um cliente");
        return;
      }

      if (!tribunalSelecionado) {
        alert("Selecione um tribunal");
        return;
      }

      const payload = {
        numeroProcesso,
        entidade: Number(entidadePai),
        reclamante,
        reclamada,
        cliente: clienteSelecionado.id,
        orgaoJulgador: tribunalSelecionado.id,
        assuntoJuridico: Number(assuntoSelecionado),
        faseProcesso: Number(faseSelecionada),
        prazo: prazoFatal,
        observacao,
      };

      console.log("PAYLOAD", payload);

      await api.post("/api/v1/processo-judicial", payload);

      alert("Processo salvo com sucesso");

      navigate("/processo");
    } catch (error) {
      console.error("Erro ao salvar processo", error);
      alert("Erro ao salvar processo");
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={0.5} color="text.primary">
        Cadastro de Processo
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Preencha as informações abaixo para iniciar a gestão de um novo
        processo.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={600}>
            Dados do Processo
          </Typography>

          {/* CLIENTE */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <Stack direction="row" spacing={1} flex={2}>
              <TextField
                fullWidth
                label="Cliente"
                placeholder="Nome completo do cliente ou empresa"
                value={clienteBusca}
                onChange={(e) => setClienteBusca(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "#5c6cff", ml: 1 }}
                      onClick={buscarCliente}
                    >
                      Buscar
                    </Button>
                  ),
                }}
              />
            </Stack>

            <TextField
              select
              label="Fase do Processo"
              sx={{ flex: 1 }}
              value={faseSelecionada}
              onChange={(e) => setFaseSelecionada(e.target.value)}
            >
              {fasesProcesso.map((fase) => (
                <MenuItem key={fase.id} value={fase.id}>
                  {fase.titulo}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {clientes.length > 0 && (
            <Paper variant="outlined">
              <List>
                {clientes.map((c) => (
                  <ListItemButton
                    key={c.id}
                    onClick={() => selecionarCliente(c)}
                  >
                    <ListItemText
                      primary={c.entidade.nomeSocial}
                      secondary={c.cnpj}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          )}

          {/* NÚMERO / TIPO / TRIBUNAL */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              sx={{ width: "600px" }}
              label="Número do Processo"
              placeholder="0000000-00.0000.0.00.0000"
              value={numeroProcesso}
              onChange={(e) => setNumeroProcesso(e.target.value)}
              required
            />

            <TextField
              sx={{ width: "300px" }}
              select
              label="Tipo de Serviço"
              value={assuntoSelecionado}
              onChange={(e) => setAssuntoSelecionado(e.target.value)}
            >
              {assuntosJuridicos.map((assunto) => (
                <MenuItem key={assunto.id} value={assunto.id}>
                  {assunto.titulo}
                </MenuItem>
              ))}
            </TextField>

            <Stack direction="row" spacing={1} flex={1}>
              <TextField
                fullWidth
                label="Tribunal"
                placeholder="Nome do tribunal"
                value={tribunalBusca}
                onChange={(e) => setTribunalBusca(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <Button
                      variant="contained"
                      sx={{ bgcolor: "#5c6cff", ml: 1 }}
                      onClick={buscarTribunal}
                    >
                      Buscar
                    </Button>
                  ),
                }}
              />
            </Stack>
          </Stack>

          {tribunais.length > 0 && (
            <Paper variant="outlined">
              <List>
                {tribunais.map((t) => (
                  <ListItemButton
                    key={t.id}
                    onClick={() => selecionarTribunal(t)}
                  >
                    <ListItemText
                      primary={t.entidade.nomeSocial}
                      secondary={t.cnpj}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          )}

          {/* RECLAMANTE / RECLAMADA */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Reclamante"
              value={reclamante}
              onChange={(e) => setReclamante(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Reclamada"
              value={reclamada}
              onChange={(e) => setReclamada(e.target.value)}
              required
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
            {/* <TextField
              label="Prazo Fatal"
              type="date"
              value={prazoFatal}
              onChange={(e) => setPrazoFatal(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 230 }}
            /> */}
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
            >
              <DatePicker
                label="Prazo Fatal"
                format="DD/MM/YYYY"
                value={prazoFatal ? dayjs(prazoFatal) : null}
                onChange={(newValue) =>
                  setPrazoFatal(newValue ? newValue.format("YYYY-MM-DD") : "")
                }
                sx={{ width: 230 }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            <FormControl>
              <FormLabel sx={{ color: "#5c6cff" }}>Prioridade</FormLabel>

              <RadioGroup value={prioridade} row>
                <FormControlLabel
                  control={<Radio {...controlProps("NORMAL")} />}
                  label="NORMAL"
                />
                <FormControlLabel
                  control={<Radio {...controlProps("ALTA")} />}
                  label="ALTA"
                />
                <FormControlLabel
                  control={<Radio {...controlProps("URGENTE")} />}
                  label="URGENTE"
                />
              </RadioGroup>
            </FormControl>
          </Stack>

          <TextField
            fullWidth
            label="Observações Adicionais"
            multiline
            rows={4}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff" }}
              onClick={salvarProcesso}
            >
              Salvar Processo
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
