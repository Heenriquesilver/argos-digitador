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
import { useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import SnackInfo from "../../components/snack-info/SnackInfo";

import Radio from "@mui/material/Radio";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import useGetEntidadeWork from "../../api/hooks/useGetEntidadeWork";
import api from "../../api/axios";

type Tprioridade = "NORMAL" | "ALTA" | "URGENTE";

export default function NovoProcessoPage() {
  const navigate = useNavigate();

  const { id } = useParams();
  const isEdit = Boolean(id);

  const { data: idEntidadeWork } = useGetEntidadeWork();

  dayjs.locale("pt-br");

  const prioridadeMap: Record<Tprioridade, number> = {
    NORMAL: 1,
    ALTA: 2,
    URGENTE: 3,
  };

  const hoje = dayjs().format("YYYY-MM-DD");

  const [prazoFatal, setPrazoFatal] = useState(hoje);
  const [dataSolicitacao, setDataSolicitacao] = useState(hoje);
  const [dataNegociada, setDataNeogciada] = useState(hoje);

  const [prioridade, setPrioridade] = useState<Tprioridade>("NORMAL");

  const [clienteBusca, setClienteBusca] = useState("");
  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);

  const [fasesProcesso, setFasesProcesso] = useState<any[]>([]);
  const [faseSelecionada, setFaseSelecionada] = useState("");

  const [assuntosJuridicos, setAssuntosJuridicos] = useState<any[]>([]);
  const [assuntoSelecionado, setAssuntoSelecionado] = useState("");

  const [classesProcesso, setClassesProcesso] = useState<any[]>([]);
  const [classeSelecionada, setClasseSelecionada] = useState("");

  const [tribunalBusca, setTribunalBusca] = useState("");
  const [tribunais, setTribunais] = useState<any[]>([]);
  const [tribunalSelecionado, setTribunalSelecionado] = useState<any>(null);
  const [numeroProcesso, setNumeroProcesso] = useState("");
  const [reclamante, setReclamante] = useState("");
  const [reclamada, setReclamada] = useState("");

  const [idDoCliente, setIdDoCliente] = useState("");
  const [observacao, setObservacao] = useState("");

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

  const handleChange = (event: SelectChangeEvent) => {
    setPrioridade(event.target.value as Tprioridade);
  };

  const controlProps = (item: Tprioridade) => ({
    checked: prioridade === item,
    onChange: handleChange,
    value: item,
    name: "prioridade-radio",
  });

  const handleUppercase = (setter: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value.toUpperCase());
    };
  };

  function formatNumeroProcesso(value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 20);

    return numbers
      .replace(/^(\d{7})(\d)/, "$1-$2")
      .replace(/^(\d{7}-\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{7}-\d{2}\.\d{4})(\d)/, "$1.$2")
      .replace(/^(\d{7}-\d{2}\.\d{4}\.\d)(\d)/, "$1.$2")
      .replace(/^(\d{7}-\d{2}\.\d{4}\.\d\.\d{2})(\d)/, "$1.$2");
  }

  const handleNumeroProcesso = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumeroProcesso(e.target.value);
    setNumeroProcesso(formatted.toUpperCase());
  };

  async function buscarProcessoPorId() {
    try {
      const res = await api.get(`/api/v1/processo-judicial/${id}`);
      const p = res.data;

      setNumeroProcesso(p.numeroProcesso || "");
      setReclamante(p.reclamante || "");
      setReclamada(p.reclamada || "");
      setObservacao(p.observacao || "");
      setIdDoCliente(p.numrExterno || "");

      setPrioridade(
        (Object.keys(prioridadeMap).find(
          (key) => prioridadeMap[key as Tprioridade] === p.prioridade,
        ) as Tprioridade) || "NORMAL",
      );

      setPrazoFatal(p.prazo || "");
      setDataSolicitacao(p.dataSolicitacao || "");
      setDataNeogciada(p.dataNegociada || "");

      // IDs (importante)
      setFaseSelecionada(p.faseProcesso?.id || "");
      setAssuntoSelecionado(p.assuntoJuridico?.id || "");
      setClasseSelecionada(p.classeProcesso?.id || "");

      // cliente
      if (p.cliente) {
        setClienteSelecionado(p.cliente);
        setClienteBusca(p.cliente?.razaoSocial || "");
      }

      // tribunal
      if (p.orgaoJulgador) {
        setTribunalSelecionado(p.orgaoJulgador);
        setTribunalBusca(p.orgaoJulgador?.nomeFantasia || "");
      }
    } catch (error) {
      console.error("Erro ao buscar processo", error);
    }
  }

  useEffect(() => {
    if (id) {
      buscarProcessoPorId();
    }
  }, [id]);

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
    async function carregarClassesProcesso() {
      try {
        const res = await api.get("/api/v1/classe-processo", {
          params: {
            page: 0,
            size: 10,
          },
        });

        setClassesProcesso(res.data.elements);
      } catch (error) {
        console.error("Erro ao carregar classes do processo", error);
      }
    }
    carregarClassesProcesso();
    carregarFasesProcesso();
    carregarAssuntosJuridicos();
  }, []);

  async function salvarProcesso() {
    try {
      const entidadePai = idEntidadeWork;

      if (!clienteSelecionado) {
        showSnack("Selecione um cliente", "warning");
        return;
      }

      if (!tribunalSelecionado) {
        showSnack("Selecione um tribunal", "warning");
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
        classeProcesso: Number(classeSelecionada),
        prioridade: prioridadeMap[prioridade],
        prazo: prazoFatal,
        observacao,
        numrExterno: idDoCliente,
        dataSolicitacao,
        dataNegociada,
      };

      if (isEdit) {
        await api.put(`/api/v1/processo-judicial/${id}`, payload);
        showSnack("Processo atualizado com sucesso!", "success");
      } else {
        await api.post("/api/v1/processo-judicial", payload);
        showSnack("Processo cadastrado com sucesso!", "success");
      }

      setTimeout(() => {
        navigate("/processo");
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar processo", error);
      showSnack("Erro ao salvar processo", "error");
    }
  }

  return (
    <Box
      sx={{
        flex: 1,
        p: 3,
        marginLeft: 2,
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
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
                      sx={{ bgcolor: "#30B2E4", ml: 1 }}
                      onClick={buscarCliente}
                    >
                      Buscar
                    </Button>
                  ),
                }}
              />
            </Stack>
            <TextField
              label="Número do Processo"
              placeholder="0000000-00.0000.0.00.0000"
              value={numeroProcesso}
              onChange={handleNumeroProcesso}
              inputProps={{ maxLength: 25 }}
              sx={{
                width: "600px",
                "& input": { textTransform: "uppercase" },
              }}
              required
            />
          </Stack>

          {clientes.length > 0 && (
            <Paper
              variant="outlined"
              sx={{
                border: "2px solid #30B2E4",
                borderRadius: 2,
              }}
            >
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
            {/* LADO ESQUERDO (igual ao Cliente) */}
            <Stack direction="row" spacing={1} flex={2}>
              <TextField
                select
                label="Fase do Processo"
                fullWidth
                value={faseSelecionada}
                onChange={(e) => setFaseSelecionada(e.target.value)}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        border: "2px solid #30B2E4",
                        borderRadius: 2,
                      },
                    },
                  },
                }}
              >
                {fasesProcesso.map((fase) => (
                  <MenuItem key={fase.id} value={fase.id}>
                    {fase.titulo}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Serviço"
                sx={{ width: "305px" }}
                value={assuntoSelecionado}
                onChange={(e) => setAssuntoSelecionado(e.target.value)}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        border: "2px solid #30B2E4",
                        borderRadius: 2,
                      },
                    },
                  },
                }}
              >
                {assuntosJuridicos.map((assunto) => (
                  <MenuItem key={assunto.id} value={assunto.id}>
                    {assunto.titulo}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            {/* LADO DIREITO (mesma largura do Número do Processo) */}
            <TextField
              select
              label="Classe do Processo"
              sx={{ width: "600px" }} // 👈 igual ao Número do Processo
              value={classeSelecionada}
              onChange={(e) => setClasseSelecionada(e.target.value)}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      border: "2px solid #30B2E4",
                      borderRadius: 2,
                    },
                  },
                },
              }}
            >
              {classesProcesso.map((classe) => (
                <MenuItem key={classe.id} value={classe.id}>
                  {classe.titulo}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          {tribunais.length > 0 && (
            <Paper
              variant="outlined"
              sx={{ border: "2px solid #30B2E4", borderRadius: 2 }}
            >
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
              onChange={handleUppercase(setReclamante)}
              required
              sx={{
                "& input": { textTransform: "uppercase" },
              }}
            />
            <TextField
              fullWidth
              label="Reclamada"
              value={reclamada}
              onChange={handleUppercase(setReclamada)}
              required
              sx={{
                "& input": { textTransform: "uppercase" },
              }}
            />
            <TextField
              fullWidth
              label="Tribunal"
              placeholder="Nome do tribunal"
              value={tribunalBusca}
              onChange={handleUppercase(setTribunalBusca)}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="contained"
                    sx={{ bgcolor: "#30B2E4", ml: 1 }}
                    onClick={buscarTribunal}
                  >
                    Buscar
                  </Button>
                ),
              }}
              sx={{
                "& input": { textTransform: "uppercase" },
              }}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              sx={{ width: 200 }}
              label="ID do processo no cliente"
              value={idDoCliente}
              onChange={(e) => setIdDoCliente(e.target.value)}
              required
            />
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
            >
              <DatePicker
                label="Data da Solicitação "
                format="DD/MM/YYYY"
                value={dataSolicitacao ? dayjs(dataSolicitacao) : null}
                onChange={(newValue: any) =>
                  setDataSolicitacao(
                    newValue ? newValue.format("YYYY-MM-DD") : "",
                  )
                }
                sx={{ width: 220 }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
            >
              <DatePicker
                label="Prazo Fatal"
                format="DD/MM/YYYY"
                value={prazoFatal ? dayjs(prazoFatal) : null}
                onChange={(newValue: any) =>
                  setPrazoFatal(newValue ? newValue.format("YYYY-MM-DD") : "")
                }
                sx={{ width: 220 }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="pt-br"
            >
              <DatePicker
                label="Data Negociada"
                format="DD/MM/YYYY"
                value={dataNegociada ? dayjs(dataNegociada) : null}
                onChange={(newValue: any) =>
                  setDataNeogciada(
                    newValue ? newValue.format("YYYY-MM-DD") : "",
                  )
                }
                sx={{ width: 220 }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            <FormControl
              sx={{
                minWidth: 0,
                flexShrink: 1,
              }}
            >
              <FormLabel sx={{ color: "#30B2E4", fontSize: 12 }}>
                Prioridade
              </FormLabel>

              <RadioGroup
                value={prioridade}
                row
                sx={{
                  flexWrap: "nowrap",
                  overflow: "hidden",
                  "& .MuiFormControlLabel-root": {
                    marginRight: 1,
                  },
                  "& .MuiFormControlLabel-label": {
                    fontSize: 12,
                    whiteSpace: "nowrap",
                  },
                }}
              >
                <FormControlLabel
                  control={<Radio {...controlProps("NORMAL")} size="small" />}
                  label="NORMAL"
                />
                <FormControlLabel
                  control={<Radio {...controlProps("ALTA")} size="small" />}
                  label="ALTA"
                />
                <FormControlLabel
                  control={<Radio {...controlProps("URGENTE")} size="small" />}
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
            sx={{
              "& input": { textTransform: "uppercase" },
            }}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              sx={{ bgcolor: "#30B2E4" }}
              onClick={salvarProcesso}
            >
              Salvar Processo
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
