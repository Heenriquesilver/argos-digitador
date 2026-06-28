import {
  Box,
  Typography,
  Button,
  Chip,
  Collapse,
  TextField,
  MenuItem,
} from "@mui/material";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItemMui from "@mui/material/MenuItem";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/GridLegacy";

import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

import { useEffect, useState } from "react";

import { ptBR } from "@mui/x-data-grid/locales";

import FilterListIcon from "@mui/icons-material/FilterList";

import api from "../../api/axios";

import useGetEntidadeWork from "../../api/hooks/useGetEntidadeWork";

type TarefaRow = {
  id: number;
  titulo: string;
  descricao: string;
  processo: string;
  cliente: string;
  reclamante: string;
  reclamada: string;
  status: string;
  statusColor: string;
  prazo: string;
};

type StatusOption = {
  id: number;
  titulo: string;
  backcolor: string;
};

export default function TarefaPage() {
  const { data: idEntidadeWork } = useGetEntidadeWork();

  const navigate = useNavigate();

  const [entidadeId, setEntidadeId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("idPessoaFisicaLogada");

    setEntidadeId(id);
  }, []);

  const [openFilter, setOpenFilter] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [selectedRow, setSelectedRow] = useState<TarefaRow | null>(null);

  const [rows, setRows] = useState<TarefaRow[]>(() => {
    const savedRows = localStorage.getItem("tarefaRows");

    return savedRows ? JSON.parse(savedRows) : [];
  });

  const [loading, setLoading] = useState(false);

  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);

  const open = Boolean(anchorEl);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: TarefaRow,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleVerDetalhes = () => {
    if (selectedRow) {
      navigate(`/tarefa/${selectedRow.id}`, {
        state: selectedRow,
      });
    }

    handleCloseMenu();
  };

  function getDefaultFiltros() {
    const hoje = new Date();

    function formatDate(date: Date) {
      return date.toISOString().split("T")[0];
    }

    return {
      status: "",
      periodoInicio: formatDate(hoje),
      periodoFim: formatDate(hoje),
    };
  }

  const [filtros, setFiltros] = useState(() => {
    const savedFiltros = localStorage.getItem("tarefaFiltros");

    return savedFiltros ? JSON.parse(savedFiltros) : getDefaultFiltros();
  });

  useEffect(() => {
    localStorage.setItem("tarefaFiltros", JSON.stringify(filtros));
  }, [filtros]);

  async function buscarStatus() {
    try {
      const res = await api.get("/api/v1/status-calculo", {
        params: {
          page: 0,
          size: 20,
        },
      });

      setStatusOptions(res.data.elements);
    } catch (error) {
      console.error("Erro ao buscar status", error);
    }
  }

  async function buscarTarefasResponsavel() {
    try {
      console.log("clicou minhas tarefas");
      console.log("entidadeId:", entidadeId);

      if (!entidadeId) return;

      setLoading(true);

      const res = await api.get(
        `/api/v1/tarefa-calculo-judicial/responsavel/${entidadeId}`,
        {
          params: {
            page: 0,
            size: 20,
          },
        },
      );

      console.log("resposta:", res.data);

      const dadosFormatados = res.data.elements.map((item: any) => ({
        id: item.id,

        titulo: item.titulo,

        processo: item.calculoJudicial?.processoJudicial?.numeroProcesso || "-",

        cliente:
          item.calculoJudicial?.processoJudicial?.cliente?.entidade
            ?.nomeSocial || "-",

        status: item.status?.titulo || "-",

        responsavel: item.responsavel?.nome || "-",

        statusColor: item.status?.backcolor || "#ccc",

        prazo: item.prazo || "-",
      }));

      setRows(dadosFormatados);

      localStorage.setItem("tarefaRows", JSON.stringify(dadosFormatados));
    } catch (error) {
      console.error("Erro ao buscar tarefas do responsável", error);
    } finally {
      setLoading(false);
    }
  }

  async function buscarTarefas() {
    try {
      if (!idEntidadeWork) return;

      setLoading(true);

      const payload = {
        status: filtros.status ? Number(filtros.status) : 0,
        responsavel: 0,
        dataInicio: filtros.periodoInicio,
        dataTermino: filtros.periodoFim,
      };

      const res = await api.post(
        `/api/v1/tarefa-calculo-judicial/filtro/${idEntidadeWork}`,
        payload,
        {
          params: {
            page: 0,
            size: 20,
          },
        },
      );

      const dadosFormatados = res.data.elements.map((item: any) => ({
        id: item.id,
        titulo: item.titulo,

        processo: item.calculoJudicial?.processoJudicial?.numeroProcesso || "-",

        cliente:
          item.calculoJudicial?.processoJudicial?.cliente?.entidade
            ?.nomeSocial || "-",

        status: item.status?.titulo || "-",

        responsavel: item.responsavel?.nome || "-",

        statusColor: item.status?.backcolor || "#ccc",

        prazo: item.calculoJudicial?.prazo || "-",
      }));

      setRows(dadosFormatados);

      localStorage.setItem("tarefaRows", JSON.stringify(dadosFormatados));
    } catch (error) {
      console.error("Erro ao buscar tarefas", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!idEntidadeWork || !entidadeId) return;

    buscarStatus();

    const savedRows = localStorage.getItem("tarefaRows");

    if (savedRows) {
      setRows(JSON.parse(savedRows));
    } else {
      buscarTarefasResponsavel();
    }
  }, [idEntidadeWork, entidadeId]);

  const columns: GridColDef<TarefaRow>[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "titulo",
      headerName: "Título",
      flex: 1.2,
      headerClassName: "cor-background-headerName",
    },

    {
      field: "processo",
      headerName: "Processo",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "cliente",
      headerName: "Cliente",
      flex: 1.2,
      headerClassName: "cor-background-headerName",
    },

    {
      field: "responsavel",
      headerName: "Responsável",
      flex: 1.2,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClassName: "cor-background-headerName",
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.row.status}
          sx={{
            backgroundColor: params.row.statusColor,
            color: "#000",
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      field: "prazo",
      headerName: "Prazo",
      flex: 1,
      headerClassName: "cor-background-headerName",
      renderCell: (params) => {
        if (!params.value) return "";

        const date = new Date(params.value);

        if (isNaN(date.getTime())) return params.value;

        return date.toLocaleDateString("pt-BR").replace(/\//g, "-");
      },
    },
    {
      field: "acoes",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      flex: 0.5,
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
        flex: 1,
        p: 3,
        marginLeft: 2,
        maxWidth: "100%",
      }}
    >
      <Box mb={2}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          Tarefas
        </Typography>

        <Typography color="text.secondary">
          Gerenciamento de tarefas judiciais
        </Typography>
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={1} mb={2}>
        <Button
          variant="contained"
          sx={{ bgcolor: "#0A1C30", height: "35px", marginTop: "9px" }}
          onClick={buscarTarefasResponsavel}
        >
          Minhas tarefas
        </Button>
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          sx={{ bgcolor: "#0A1C30", height: "35px", marginTop: "9px" }}
          onClick={() => setOpenFilter(!openFilter)}
        >
          Filtrar
        </Button>
      </Box>

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
                select
                label="Status"
                value={filtros.status}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    status: e.target.value,
                  })
                }
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.titulo}
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
                  setFiltros({
                    ...filtros,
                    periodoInicio: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                label="Fim"
                InputLabelProps={{ shrink: true }}
                value={filtros.periodoFim}
                onChange={(e) =>
                  setFiltros({
                    ...filtros,
                    periodoFim: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                sx={{ bgcolor: "#30B2E4" }}
                onClick={buscarTarefas}
                disabled={loading}
              >
                {loading ? "Buscando..." : "Aplicar"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      <Box sx={{ width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          pageSizeOptions={[20]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
                page: 0,
              },
            },
          }}
          sx={{
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              color: "white",
            },

            "& .cor-background-headerName": {
              backgroundColor: "#184272ff",
            },
          }}
        />
        <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
          <MenuItemMui onClick={handleVerDetalhes}>Ver detalhes</MenuItemMui>
        </Menu>
      </Box>
    </Box>
  );
}
