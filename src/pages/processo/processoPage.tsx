import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Collapse,
  TextField,
  MenuItem,
} from "@mui/material";
import Menu from "@mui/material/Menu";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import Grid from "@mui/material/GridLegacy";
import { DataGrid } from "@mui/x-data-grid";
import type { GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { ptBR } from "@mui/x-data-grid/locales";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { GridColDef } from "@mui/x-data-grid";
import MetricCard from "../../components/MetricCard";
import { useNavigate } from "react-router-dom";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import api from "../../api/axios";

type ProcessoRow = {
  id: number;
  processo: string;
  cliente: string;
  reclamada: string;
  reclamante: string;

  tipoServico: string;
  fase: string;
  tribunal: string;
  status: string;
  prioridade: Tprioridade;
  prazo: string;
};

type Tprioridade = "NORMAL" | "ALTA" | "URGENTE";

export default function ProcessoPage() {
  const navigate = useNavigate();

  dayjs.locale("pt-br");

  const [openFilter, setOpenFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<ProcessoRow | null>(null);
  const [rowsOriginal, setRowsOriginal] = useState<ProcessoRow[]>([]);

  const prioridadeLabelMap: Record<number, Tprioridade> = {
    1: "NORMAL",
    2: "ALTA",
    3: "URGENTE",
  };

  const [rows, setRows] = useState<ProcessoRow[]>([]);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<GridRowId>(),
  });

  const hoje = new Date();
  const maisDoisDias = new Date();
  maisDoisDias.setDate(hoje.getDate() + 2);

  function formatDate(date: Date) {
    return date.toISOString().split("T")[0];

    const hoje = new Date();
    const maisDoisDias = new Date();
    maisDoisDias.setDate(hoje.getDate() + 2);
  }

  const [filtros, setFiltros] = useState({
    numero: "",
    cliente: "",
    tipoServico: "-",
    status: "",
    periodoInicio: formatDate(hoje),
    prazo: formatDate(maisDoisDias),
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

  const buscarProcessos = async () => {
    try {
      const response = await api.get("/api/v1/processo-judicial", {
        params: {
          termo: "",
          page: 0,
          size: 100,
        },
      });

      const processos: ProcessoRow[] = (response.data?.elements || []).map(
        (p: any) => ({
          id: p.id,
          processo: p.numeroProcesso,
          cliente: p.cliente?.razaoSocial || "",
          reclamada: p.reclamada || "",
          reclamante: p.reclamante || "",
          tipoServico: p.assuntoJuridico?.titulo || "",
          fase: p.faseProcesso?.titulo || "",
          tribunal: p.orgaoJulgador?.nomeFantasia || "",
          status: "Em Análise",
          prioridade: prioridadeLabelMap[p.prioridade],
          prazo: p.prazo,
        }),
      );

      setRowsOriginal(processos);
      setRows(processos);
    } catch (error: any) {
      console.error("Erro ao buscar processos", error.response?.data || error);
      setRows([]);
    }
  };

  useEffect(() => {
    const carregar = async () => {
      await buscarProcessos();
    };

    carregar();
  }, []);

  const aplicarFiltros = () => {
    let filtrados = [...rowsOriginal];

    if (filtros.numero) {
      filtrados = filtrados.filter((p) =>
        p.processo.toLowerCase().includes(filtros.numero.toLowerCase()),
      );
    }

    if (filtros.cliente) {
      filtrados = filtrados.filter((p) =>
        p.cliente.toLowerCase().includes(filtros.cliente.toLowerCase()),
      );
    }

    if (filtros.status) {
      filtrados = filtrados.filter((p) => p.status === filtros.status);
    }

    if (filtros.periodoInicio) {
      filtrados = filtrados.filter(
        (p) => p.prazo && p.prazo >= filtros.periodoInicio,
      );
    }

    if (filtros.prazo) {
      filtrados = filtrados.filter((p) => p.prazo && p.prazo <= filtros.prazo);
    }

    setRows(filtrados);
  };

  const limparFiltro = () => {
    setFiltros({
      numero: "",
      cliente: "",
      tipoServico: "-",
      status: "",
      periodoInicio: "",
      prazo: "",
      responsavel: "",
    });
  };
  const columns: GridColDef<ProcessoRow>[] = [
    {
      field: "processo",
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
      field: "reclamante",
      headerName: "Reclamante",
      flex: 1.3,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "reclamada",
      headerName: "Reclamada",
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
      field: "tribunal",
      headerName: "Tribunal",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value}
          color={
            params.value === "Finalizado"
              ? "success"
              : params.value === "Em Análise"
                ? "warning"
                : "info"
          }
        />
      ),
      headerClassName: "cor-background-headerName",
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
      {/* HEADER */}
      <Grid container alignItems="center" mb={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Dashboard de Processos
          </Typography>
          <Typography color="text.secondary">
            Monitoramento e gestão em tempo real.
          </Typography>
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
          startIcon={<AddIcon />}
          sx={{ bgcolor: "#5c6cff", py: 1.3 }}
          onClick={() => navigate("/novo-processo")}
        >
          Novo Processo
        </Button>
        <Button
          variant="contained"
          //   startIcon={<FilterListIcon />}
          disabled={selectionModel.ids.size === 0}
          sx={{ bgcolor: "#5c6cff", py: 1.3 }}
          onClick={() => {
            const idsSelecionados = Array.from(selectionModel.ids);

            const selecionados = rows.filter((row) =>
              idsSelecionados.includes(row.id),
            );

            navigate("/distribuicao-carga", {
              state: { processos: selecionados },
            });
          }}
        >
          Distribuir
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
                fullWidth
                select
                label="Status"
                value={filtros.status}
                onChange={(e) =>
                  setFiltros({ ...filtros, status: e.target.value })
                }
              >
                <MenuItem value="Todos">Todos</MenuItem>
                <MenuItem value="Em Análise">Em Análise</MenuItem>
                <MenuItem value="Calculando">Calculando</MenuItem>
                <MenuItem value="Finalizado">Finalizado</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DatePicker
                  label="Período Início"
                  value={
                    filtros.periodoInicio ? dayjs(filtros.periodoInicio) : null
                  }
                  onChange={(newValue) =>
                    setFiltros({
                      ...filtros,
                      periodoInicio: newValue
                        ? newValue.format("YYYY-MM-DD")
                        : "",
                    })
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={4}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DatePicker
                  label="Período Fim"
                  value={filtros.prazo ? dayjs(filtros.prazo) : null}
                  onChange={(newValue) =>
                    setFiltros({
                      ...filtros,
                      prazo: newValue ? newValue.format("YYYY-MM-DD") : "",
                    })
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
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

            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={1}>
              <Button
                variant="contained"
                sx={{ bgcolor: "#5c6cff" }}
                onClick={limparFiltro}
              >
                Limpar
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#5c6cff" }}
                onClick={aplicarFiltros}
              >
                Aplicar
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
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={(newSelection) =>
            setSelectionModel(newSelection)
          }
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          pageSizeOptions={[5]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5, page: 0 },
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
          <MenuItem
            onClick={() => console.log("linhaSelecionada", selectedRow)}
          >
            Editar
          </MenuItem>
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
      </Box>
    </Box>
  );
}
