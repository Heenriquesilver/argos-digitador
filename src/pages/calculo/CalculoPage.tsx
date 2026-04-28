import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Collapse,
  TextField,
  Paper,
  Stack,
  Modal,
  MenuItem,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import Grid from "@mui/material/GridLegacy";
import { DataGrid } from "@mui/x-data-grid";
import type { GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { ptBR } from "@mui/x-data-grid/locales";

import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { GridColDef } from "@mui/x-data-grid";
import MetricCard from "../../components/MetricCard";
import { useNavigate } from "react-router-dom";
import useGetEntidadeWork from "../../api/hooks/useGetEntidadeWork";
import api from "../../api/axios";
import Autocomplete from "@mui/material/Autocomplete";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

import SnackInfo from "../../components/snack-info/SnackInfo";

type Tprioridade = "NORMAL" | "ALTA" | "URGENTE";

type ProcessoRow = {
  tipoServico: string;
  id: number;
  fase: string;
  processo: string;
  cliente: string;
  origem: string;
  status: string;
  prioridade: string;
  prazo: string;
};

type StatusOption = {
  id: number;
  titulo: string;
  backcolor: string;
};

export default function CalculoPage() {
  const navigate = useNavigate();

  const [openFilter, setOpenFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<ProcessoRow | null>(null);
  const [rows, setRows] = useState<ProcessoRow[]>([]);
  const [loading, setLoading] = useState(false);
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

  const [openModalEmpreitada, setOpenModalEmpreitada] = useState(false);
  const [pacotes, setPacotes] = useState<any[]>([]);
  const [pacoteSelecionado, setPacoteSelecionado] = useState<any | null>(null);
  const [loadingPacotes, setLoadingPacotes] = useState(false);
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);

  const prioridadeLabelMap: Record<number, Tprioridade> = {
    1: "NORMAL",
    2: "ALTA",
    3: "URGENTE",
  };

  const [openModalDistribuir, setOpenModalDistribuir] = useState(false);
  const [processosSelecionados, setProcessosSelecionados] = useState<
    ProcessoRow[]
  >([]);

  const [equipes, setEquipes] = useState<any[]>([]);
  const [equipeSelecionada, setEquipeSelecionada] = useState<number | null>(
    null,
  );
  const [membrosEquipe, setMembrosEquipe] = useState<any[]>([]);
  const [membroSelecionado, setMembroSelecionado] = useState<number | "">("");

  const { data: idEntidadeWork } = useGetEntidadeWork();

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<GridRowId>(),
  });

  function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  function formatToISO(data: Date) {
    return data.toISOString();
  }
  function adicionarDias(data: Date, dias: number) {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);
    return novaData;
  }

  const hoje = new Date();
  const maisDoisDias = new Date();
  maisDoisDias.setDate(hoje.getDate() + 2);

  const [filtros, setFiltros] = useState({
    numero: "",
    cliente: "",
    tipoServico: "-",
    status: "",
    periodoInicio: formatDate(hoje),
    periodoFim: formatDate(maisDoisDias),
    responsavel: "",
  });

  const open = Boolean(anchorEl);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: ProcessoRow,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  async function criarPacoteItens() {
    try {
      if (!pacoteSelecionado) {
        showSnack("Calculo criado com sucesso!", "success");
        return;
      }

      if (processosSelecionados.length === 0) {
        alert("Nenhum processo selecionado");
        return;
      }

      console.log("Itens para envio:", processosSelecionados);

      await Promise.all(
        processosSelecionados.map(async (proc) => {
          console.log("Enviando:", proc.id);

          return api.post("/api/v1/pacote-calculo-item", {
            pacoteCalculo: pacoteSelecionado.id,
            calculoJudicial: proc.id,
          });
        }),
      );

      showSnack("Item realocado com sucesso!", "success");

      setOpenModalEmpreitada(false);
      setPacoteSelecionado(null);
      setProcessosSelecionados([]);

      buscarCalculos();
    } catch (error) {
      console.error("Erro ao criar itens do pacote", error);
    }
  }

  async function buscarStatus() {
    try {
      const res = await api.get("/api/v1/status-calculo", {
        params: { page: 0, size: 20 },
      });

      setStatusOptions(res.data.elements);
    } catch (error) {
      console.error("Erro ao buscar status", error);
    }
  }

  async function buscarEquipes() {
    try {
      const res = await api.get("/api/v1/equipe", {
        params: { page: 0, size: 100 },
      });

      setEquipes(res.data.elements);
    } catch (error) {
      console.error("Erro ao buscar equipes", error);
    }
  }

  async function buscarMembrosEquipe(id: number) {
    try {
      const res = await api.get(`/api/v1/membro-equipe/equipe/${id}`, {
        params: { page: 0, size: 100 },
      });

      setMembrosEquipe(
        res.data.elements.map((item: any) => ({
          id: item.membro?.id,
          nome: item.membro?.nome,
        })),
      );
    } catch (error) {
      console.error("Erro ao buscar membros", error);
    }
  }

  useEffect(() => {
    if (openModalDistribuir) {
      buscarEquipes();
    }
  }, [openModalDistribuir]);

  const columns: GridColDef<ProcessoRow>[] = [
    {
      field: "processo",
      headerName: "Número Processo",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "id",
      headerName: "ID Processo",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "cliente",
      headerName: "Cliente",
      flex: 1.3,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "tipoServico",
      headerName: "Tipo de Serviço",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "fase",
      headerName: "Fase",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "responsavel",
      headerName: "Responsavel",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClassName: "cor-background-headerName",
      renderCell: (params) => {
        const status = statusOptions.find((s) => s.titulo === params.value);

        return (
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: status?.backcolor || "#ccc",
              }}
            />
            {params.value}
          </Box>
        );
      },
    },
    {
      field: "prioridade",
      headerName: "Prioridade",
      flex: 1,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color={
            params.value === "ALTA"
              ? "error"
              : params.value === "Normal"
                ? "default"
                : "success"
          }
        />
      ),
      headerClassName: "cor-background-headerName",
    },
    {
      field: "prazo",
      headerName: "Prazo",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "acoes",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(event) => handleOpenMenu(event, params.row)}
        >
          <MoreVertIcon />
        </IconButton>
      ),
      headerClassName: "cor-background-headerName",
    },
  ];

  async function buscarCalculos() {
    try {
      console.log("idEntidadeWork", idEntidadeWork);
      if (!idEntidadeWork) return;

      setLoading(true);

      const entidade = idEntidadeWork;

      const payload = {
        numeroProcesso: filtros.numero?.trim() || "",
        cliente: filtros.cliente?.trim() ? Number(filtros.cliente) : 0,
        status: filtros.status ? Number(filtros.status) : 0,
        responsavel: filtros.responsavel?.trim()
          ? Number(filtros.responsavel)
          : 0,
        dataInicio: filtros.periodoInicio || null,
        dataTermino: filtros.periodoFim || null,
      };

      console.log("PAYLOAD FINAL", payload);
      console.log("ENTIDADE", entidade);

      const res = await api.post(
        `/api/v1/calculo-judicial/filtro/${entidade}`,
        payload,
        {
          params: {
            page: 0,
            size: 10,
          },
        },
      );

      const dadosFormatados = res.data.elements.map((item: any) => ({
        id: item.id,
        processo: item.processoJudicial.numeroProcesso,
        cliente: item.processoJudicial.cliente?.entidade?.nomeSocial || "",
        tipoServico: item.processoJudicial.assuntoJuridico?.titulo || "",
        fase: item.processoJudicial.faseProcesso?.titulo || "",
        responsavel: item.responsavel?.nome || "",
        status: item.status?.titulo || "",
        prioridade: prioridadeLabelMap[item.prioridade],
        prazo: item.prazo,
      }));

      setRows(dadosFormatados);

      setSelectionModel({
        type: "include",
        ids: new Set(),
      });
    } catch (error) {
      console.error("Erro ao buscar cálculos", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    buscarStatus();
  }, []);

  // useEffect(() => {
  //   const fetchPessoas = async () => {
  //     try {
  //       const entidadePai = localStorage.getItem("idEntidadeUsuarioLogado");

  //       const response = await api.get("/api/v1/pessoa_fisica", {
  //         params: {
  //           entidade_pai: Number(entidadePai),
  //           page: 0,
  //           size: 10,
  //         },
  //       });

  //       setPessoas(response.data?.elements || []);
  //     } catch (error) {
  //       console.error("Erro ao buscar pessoas", error);
  //     }
  //   };

  //   fetchPessoas();
  // }, [openModalDistribuir, pessoaSelecionada]);

  async function atribuirProcesso(proc: ProcessoRow) {
    try {
      if (!membroSelecionado) {
        alert("Selecione um responsável");
        return;
      }

      const payload = {
        processoJudicial: proc.id,
        status: 2,
        responsavel: Number(membroSelecionado),
        prioridade: "1",
        alocacao: new Date().toISOString(),
        inicio: new Date().toISOString(),
        termino: new Date().toISOString(),
        prazo: proc.prazo,
        observacao: "",
      };

      await api.put(`/api/v1/calculo-judicial/${proc.id}`, payload);

      setProcessosSelecionados((prev) => prev.filter((p) => p.id !== proc.id));

      showSnack("Calculo realocado com sucesso!", "success");

      buscarCalculos(); // atualiza tabela
    } catch (error) {
      console.error("Erro ao atribuir", error);
    }
  }

  // async function buscarPessoas() {
  //   try {
  //     const res = await api.get("/api/v1/pessoa_fisica", {
  //       params: {
  //         entidade_pai: idEntidadeWork,
  //         page: 0,
  //         size: 50,
  //       },
  //     });

  //     setPessoas(res.data.elements);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // useEffect(() => {
  //   if (openModalDistribuir) {
  //     buscarPessoas();
  //   }
  // }, [openModalDistribuir]);

  async function buscarPacotes(filtro: string) {
    try {
      if (!idEntidadeWork) return;

      setLoadingPacotes(true);

      const payload = {
        titulo: filtro,
        numeroProcesso: "",
        responsavel: 0,
        status: 1,
        dataInicio: formatToISO(adicionarDias(hoje, -30)),
        dataTermino: formatToISO(adicionarDias(hoje, 30)),
      };

      const res = await api.post(
        `/api/v1/pacote-calculo/filtro/${idEntidadeWork}`,
        payload,
        {
          params: { page: 0, size: 10 },
        },
      );

      setPacotes(res.data.elements);
    } catch (error) {
      console.error("Erro ao buscar pacotes", error);
    } finally {
      setLoadingPacotes(false);
    }
  }

  const handleCalcular = () => {
    if (selectedRow) {
      navigate(`/calculo/${selectedRow.id}`, {
        state: selectedRow,
      });
    }
    handleCloseMenu();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100%",
        width: "100%",
        p: 4,
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <Grid container alignItems="center" mb={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Dashboard de Calculos
          </Typography>
          <Typography color="text.secondary">
            Monitoramento e gestão em tempo real.
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
          mt={{ xs: 2, md: 0 }}
        >
          <Button
            variant="contained"
            // startIcon={<AddIcon />}
            sx={{ bgcolor: "#5c6cff", py: 1.3 }}
            onClick={() => navigate("/distribuicao-carga")}
          >
            Carga de trabalho
          </Button>
        </Grid>
      </Grid>

      {/* MÉTRICAS */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total em Aberto"
            value={124}
            change="-4 novos hoje"
            icon={<CheckCircleIcon sx={{ color: "#4F46E5" }} />}
            iconBg="#E0E7FF"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Aguardando Cálculo"
            value={18}
            change="Prioridade Alta"
            icon={<AutoAwesomeIcon sx={{ color: "#7C3AED" }} />}
            iconBg="#F3E8FF"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Urgentes"
            value={5}
            change="Ação Requerida"
            icon={<MonetizationOnIcon sx={{ color: "#FBBF24" }} />}
            iconBg="#FEF3C7"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Concluídos Hoje"
            value={32}
            change="+ 12% vs ontem"
            icon={<AttachMoneyIcon sx={{ color: "#16A34A" }} />}
            iconBg="#DCFCE7"
          />
        </Grid>
      </Grid>

      {/* BOTÃO FILTRO */}
      <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
        <Button
          variant="contained"
          sx={{ bgcolor: "#5c6cff", py: 1.3 }}
          onClick={() => {
            const idsSelecionados = Array.isArray(selectionModel)
              ? selectionModel
              : Array.from(selectionModel.ids || []);

            const processos = rows.filter((row) =>
              idsSelecionados.includes(row.id),
            );

            setProcessosSelecionados(processos);
            setOpenModalEmpreitada(true);
          }}
        >
          Empreitada
        </Button>
        <Button
          variant="contained"
          //   startIcon={<FilterListIcon />}
          disabled={selectionModel.ids.size === 0}
          sx={{ bgcolor: "#5c6cff", py: 1.3 }}
          onClick={() => {
            const idsSelecionados = Array.from(selectionModel.ids);

            const processos = rows.filter((row) =>
              idsSelecionados.includes(row.id),
            );

            setProcessosSelecionados(processos);
            setOpenModalDistribuir(true);
          }}
        >
          Realocar
        </Button>
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          sx={{ bgcolor: "#5c6cff", py: 1.3 }}
          onClick={() => setOpenFilter(!openFilter)}
        >
          Filtrar
        </Button>
      </Box>

      {/* FILTRO EXPANSÍVEL */}
      <Collapse in={openFilter}>
        <Box
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            backgroundColor: "#F9FAFB",
            border: "1px solid #E5E7EB",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Número do Processo"
                value={filtros.numero}
                onChange={(e) =>
                  setFiltros({ ...filtros, numero: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Cliente"
                value={filtros.cliente}
                onChange={(e) =>
                  setFiltros({ ...filtros, cliente: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Status"
                value={filtros.status}
                onChange={(e) =>
                  setFiltros({ ...filtros, status: e.target.value })
                }
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: status.backcolor,
                        }}
                      />
                      {status.titulo}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Inicio"
                InputLabelProps={{ shrink: true }}
                value={filtros.periodoInicio}
                onChange={(e) =>
                  setFiltros({ ...filtros, periodoInicio: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Termino"
                InputLabelProps={{ shrink: true }}
                value={filtros.periodoFim}
                onChange={(e) =>
                  setFiltros({ ...filtros, periodoFim: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Responsável"
                value={filtros.responsavel}
                onChange={(e) =>
                  setFiltros({ ...filtros, responsavel: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{ bgcolor: "#5c6cff" }}
                onClick={buscarCalculos}
                disabled={loading}
              >
                {loading ? "Buscando..." : "Aplicar"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      {/* TABELA */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={(newSelection) =>
            setSelectionModel(newSelection)
          }
          localeText={{
            ...ptBR.components.MuiDataGrid.defaultProps.localeText,
            noRowsLabel: loading
              ? "Carregando..."
              : "Nenhum resultado encontrado",
          }}
          pageSizeOptions={[20]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 20, page: 0 },
            },
          }}
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
            },
            "& .cor-background-headerName": {
              backgroundColor: "#E0E7FF",
            },
            "& .MuiDataGrid-columnHeaderCheckbox": {
              backgroundColor: "#E0E7FF",
            },
          }}
        />
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          <MenuItem onClick={handleCalcular}>Ver Detalhes</MenuItem>
          <MenuItem
            onClick={() => console.log("linhaSelecionada", selectedRow)}
          >
            Desativar
          </MenuItem>
          <MenuItem
            onClick={() => console.log("linhaSelecionada", selectedRow)}
          >
            Distribuir
          </MenuItem>
        </Menu>
        <Modal
          open={openModalDistribuir}
          onClose={() => setOpenModalDistribuir(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
            }}
          >
            <IconButton
              onClick={() => {
                setOpenModalDistribuir(false);
                setSelectionModel({
                  type: "include",
                  ids: new Set(),
                });
              }}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography fontWeight={600} mb={2}>
                Distribuir Processos
              </Typography>

              <TextField
                fullWidth
                select
                size="small"
                label="Equipe"
                value={equipeSelecionada ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setEquipeSelecionada(id);
                  buscarMembrosEquipe(id);
                  setMembroSelecionado("");
                }}
                sx={{ mb: 2 }}
              >
                {equipes.map((eq) => (
                  <MenuItem key={eq.id} value={eq.id}>
                    {eq.titulo}
                  </MenuItem>
                ))}
              </TextField>

              {/* SELECT MEMBRO */}
              <TextField
                fullWidth
                select
                size="small"
                label="Selecionar responsável"
                value={membroSelecionado}
                onChange={(e) => setMembroSelecionado(Number(e.target.value))}
                disabled={!equipeSelecionada}
                sx={{ mb: 3 }}
              >
                {membrosEquipe.map((membro) => (
                  <MenuItem key={membro.id} value={membro.id}>
                    {membro.nome}
                  </MenuItem>
                ))}
              </TextField>

              <Stack spacing={2} maxHeight={400} overflow="auto">
                {processosSelecionados.map((proc) => (
                  <Paper
                    key={proc.id}
                    sx={{ p: 2, borderRadius: 2, border: "1px solid #eee" }}
                  >
                    <Chip
                      size="small"
                      label={proc.tipoServico}
                      sx={{ mb: 1 }}
                    />

                    <Typography fontWeight={600} fontSize={14}>
                      {proc.processo}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {proc.cliente}
                    </Typography>

                    <Typography variant="caption">Fase: {proc.fase}</Typography>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mt={2}
                      alignItems="center"
                    >
                      <Typography variant="caption">
                        Prazo: {proc.prazo || "N/A"}
                      </Typography>

                      <Button
                        size="small"
                        variant="contained"
                        sx={{ bgcolor: "#5c6cff" }}
                        onClick={() => atribuirProcesso(proc)}
                      >
                        Atribuir
                      </Button>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Paper>
          </Box>
        </Modal>
        <Modal
          open={openModalEmpreitada}
          onClose={() => setOpenModalEmpreitada(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 1200,
            }}
          >
            <IconButton
              onClick={() => setOpenModalEmpreitada(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "grey.500",
                "&:hover": {
                  color: "grey.700",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography fontWeight={600} mb={2}>
                Vincular à Empreitada
              </Typography>

              {/* AUTOCOMPLETE */}
              <Autocomplete
                options={pacotes}
                getOptionLabel={(option) => option.titulo || ""}
                loading={loadingPacotes}
                onInputChange={(_, value) => buscarPacotes(value)}
                onChange={(_, value) => setPacoteSelecionado(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Buscar Pacote" size="small" />
                )}
                sx={{ mb: 3 }}
              />

              {/* TABELA COM SELECIONADOS */}
              <DataGrid
                rows={processosSelecionados}
                columns={columns}
                autoHeight
                hideFooter
              />

              {/* BOTÃO */}
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#5c6cff" }}
                  onClick={criarPacoteItens}
                >
                  Salvar
                </Button>
              </Box>
            </Paper>
          </Box>
        </Modal>
      </Box>
      <SnackInfo
        open={snackOpen}
        message={snackMessage}
        type={snackType}
        onClose={() => setSnackOpen(false)}
      />
    </Box>
  );
}
