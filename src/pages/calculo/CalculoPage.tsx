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

import Grid from "@mui/material/GridLegacy";
import { DataGrid } from "@mui/x-data-grid";
import type { GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { useState } from "react";
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

type ProcessoRow = {
  id: number;
  processo: string;
  cliente: string;
  origem: string;
  status: string;
  prioridade: string;
  prazo: string;
};

export default function CalculoPage() {
  const navigate = useNavigate();

  const [openFilter, setOpenFilter] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<ProcessoRow | null>(null);

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set<GridRowId>(),
  });

  const [filtros, setFiltros] = useState({
    numero: "",
    cliente: "",
    tipoServico: "-",
    status: "",
    periodoInicio: "",
    periodoFim: "",
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

  const rows = [
    {
      id: 1,
      processo: "#LC-2023-099",
      cliente: "Ana Souza",
      tipoServico: "-",
      fase: "-",
      origem: "Trabalhista",
      status: "Em Análise",
      prioridade: "ALTA",
      prazo: "24/10/2023",
    },
    {
      id: 2,
      processo: "#LC-2023-085",
      cliente: "Construtora Melo",
      tipoServico: "-",
      fase: "-",
      origem: "Cível",
      status: "Calculando",
      prioridade: "Normal",
      prazo: "28/10/2023",
    },
    {
      id: 3,
      processo: "#LC-2023-042",
      cliente: "Roberto Faria",
      tipoServico: "-",
      fase: "-",
      origem: "Previdenciário",
      status: "Finalizado",

      prioridade: "Baixa",
      prazo: "30/10/2023",
    },
    {
      id: 4,
      processo: "#LC-2023-031",
      cliente: "Júlia Lima",
      tipoServico: "-",
      fase: "-",
      origem: "Trabalhista",
      status: "Finalizado",
      prioridade: "Normal",
      prazo: "01/11/2023",
    },
  ];

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
            startIcon={<AddIcon />}
            sx={{ bgcolor: "#5c6cff", py: 1.3 }}
            onClick={() => navigate("/novo-processo")}
          >
            Novo Processo
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
          //   startIcon={<FilterListIcon />}
          disabled={selectionModel.ids.size === 0}
          sx={{ bgcolor: "#5c6cff", py: 1.3 }}
          onClick={() => navigate("/distribuicao-carga", {})}
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
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Em Análise">Em Análise</MenuItem>
                <MenuItem value="Calculando">Calculando</MenuItem>
                <MenuItem value="Finalizado">Finalizado</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Período Início"
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
                label="Período Fim"
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
                onClick={() => console.log("Aplicar filtros:", filtros)}
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
