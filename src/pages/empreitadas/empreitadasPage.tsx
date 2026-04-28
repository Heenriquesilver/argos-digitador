import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Collapse,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import EditIcon from "@mui/icons-material/Edit";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import { ptBR } from "@mui/x-data-grid/locales";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import Grid from "@mui/material/GridLegacy";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Modal, Paper } from "@mui/material";

import api from "../../api/axios";
import useGetEntidadeWork from "../../api/hooks/useGetEntidadeWork";

type RowType = {
  id: number | string;
  titulo?: string;
  isDetail?: boolean;
  parentId?: number;
};

type StatusOption = {
  id: number;
  titulo: string;
  backcolor: string;
};

export default function EmpreitadasPage() {
  const [rows, setRows] = useState<RowType[]>([]);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [detalhesSelecionados, setDetalhesSelecionados] = useState<any[]>([]);

  const [openFilter, setOpenFilter] = useState(false);

  const hoje = new Date();
  const maisDoisDias = new Date();
  maisDoisDias.setDate(hoje.getDate() + 2);

  const [filtros, setFiltros] = useState({
    titulo: "",
    status: "",
    periodoInicio: formatDate(hoje),
    periodoFim: formatDate(maisDoisDias),
  });

  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);

  const [detalhesMap, setDetalhesMap] = useState<Record<number, any[]>>({});
  const [loadingDetalhes, setLoadingDetalhes] = useState(false);

  const { data: idEntidadeWork } = useGetEntidadeWork();
  // const responsavel = localStorage.getItem("idPessoaFisicaLogada");

  function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
  }

  const navigate = useNavigate();

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

  useEffect(() => {
    buscarStatus();
  }, []);

  function formatarData(data: string) {
    if (!data) return "-";

    return dayjs(data).format("DD/MM/YYYY");
  }

  async function buscarEmpreitadas() {
    try {
      if (!idEntidadeWork) return;

      setLoading(true);

      const payload = {
        titulo: filtros.titulo || "",
        numeroProcesso: "",
        responsavel: 0,
        status: filtros.status ? Number(filtros.status) : 0,
        dataInicio: filtros.periodoInicio || null,
        dataTermino: filtros.periodoFim || null,
      };

      const res = await api.post(
        `/api/v1/pacote-calculo/filtro/${idEntidadeWork}`,
        payload,
        { params: { page: 0, size: 10 } },
      );

      const formatted = res.data?.elements.map((item: any) => ({
        id: item.id,
        titulo: item.titulo,
        responsavel: item.responsavel.nome,
        status: item.status.titulo,
        valor: item.valor,
        valorAp: item.valorAP,
        qtdeAP: item.qtdeAP,
        prazo: formatarData(item.prazo),
      }));

      setRows(formatted || []);
    } catch (error) {
      console.error("Erro ao buscar empreitadas", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDetalhes(id: number) {
    try {
      setLoadingDetalhes(true);

      const response = await api.get(
        `/api/v1/pacote-calculo-item/pacote/${id}`,
      );

      const lista =
        response.data?.elements ||
        (Array.isArray(response.data) ? response.data : [response.data]);

      return lista.map((item: any, index: number) => ({
        id: item?.calculoJudicial?.id ?? index,
        numeroProcesso:
          item?.calculoJudicial?.processoJudicial?.numeroProcesso ||
          "Sem número",
        cliente:
          item?.calculoJudicial?.processoJudicial?.cliente?.nomeFantasia ||
          "Sem cliente",
        prazo: formatarData(item?.calculoJudicial?.prazo) || "-",
        numeroExterno: item?.processoJudicial?.numrExterno || "-",
        status: item?.calculoJudicial?.status.titulo || "-",
      }));
    } catch (error) {
      console.error("Erro ao buscar detalhes", error);
      return [];
    } finally {
      setLoadingDetalhes(false);
    }
  }

  // async function toggleExpand(rowId: number) {
  //   const alreadyExpanded = rows.some(
  //     (r) => r.isDetail && r.parentId === rowId,
  //   );

  //   if (alreadyExpanded) {
  //     setRows((prev) => prev.filter((r) => r.parentId !== rowId));
  //     return;
  //   }

  //   let detalhesData = detalhesMap[rowId];

  //   if (!detalhesData) {
  //     detalhesData = await fetchDetalhes(rowId);

  //     setDetalhesMap((prev) => ({
  //       ...prev,
  //       [rowId]: detalhesData,
  //     }));
  //   }

  //   setRows((prev) => {
  //     const index = prev.findIndex((r) => r.id === rowId);

  //     const newRows = [...prev];

  //     newRows.splice(index + 1, 0, {
  //       id: `Calculo-${rowId}`,
  //       isDetail: true,
  //       parentId: rowId,
  //     });

  //     return newRows;
  //   });
  // }
  const columnsDetalhes: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "numeroProcesso",
      headerName: "Processo",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "cliente",
      headerName: "Cliente",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "numeroExterno",
      headerName: "Numr Ext",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "prazo",
      headerName: "Prazo",
      width: 120,
      headerClassName: "cor-background-headerName",
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "responsavel",
      headerName: "Responsavel",
      width: 200,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "titulo",
      headerName: "Título",
      flex: 1,
      headerClassName: "cor-background-headerName",

      renderCell: (params) => {
        if (params.row.isDetail) {
          const data = detalhesMap[params.row.parentId] || [];

          return (
            <Box p={2}>
              <DataGrid
                rows={data}
                columns={columnsDetalhes}
                autoHeight
                hideFooter
                loading={loadingDetalhes}
                sx={{
                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                  },
                  "& .cor-background-headerName": {
                    backgroundColor: "#E0E7FF",
                  },
                }}
              />
            </Box>
          );
        }

        return params.value;
      },
    },
    {
      field: "valor",
      headerName: "Valor Unit",
      width: 90,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "valorAp",
      headerName: "Valor AP",
      width: 90,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "qtdeAP",
      headerName: "Qtde AP",
      width: 90,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
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
      field: "prazo",
      headerName: "Prazo",
      width: 120,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "acoes",
      headerName: "Ações",
      headerClassName: "cor-background-headerName",
      width: 150,
      renderCell: (params) => {
        if (params.row.isDetail) return null;

        return (
          <Box display="flex" gap={1}>
            <Tooltip title="Ver detalhes" arrow>
              <IconButton
                onClick={async () => {
                  setSelectedRow(params.row);
                  setOpenModal(true);

                  let detalhesData = detalhesMap[params.row.id];

                  if (!detalhesData) {
                    detalhesData = await fetchDetalhes(params.row.id);

                    setDetalhesMap((prev) => ({
                      ...prev,
                      [params.row.id]: detalhesData,
                    }));
                  }

                  setDetalhesSelecionados(detalhesData);
                }}
              >
                {rows.some((r) => r.parentId === params.row.id) ? (
                  <VisibilityIcon sx={{ color: "#5c6cff" }} />
                ) : (
                  <VisibilityIcon />
                )}
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={() => navigate(`/equipe/${params.row.id}/editar`)}
            >
              <EditIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Box p={4}>
      <Grid item xs={12} md={6}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          Empreitadas
        </Typography>
        <Typography color="text.secondary">
          Gerenciamento de empreitadas.
        </Typography>
      </Grid>

      <Box display="flex" justifyContent="flex-end" gap={1} mb={2}>
        <Button
          onClick={() => setOpenFilter(!openFilter)}
          variant="contained"
          sx={{ bgcolor: "#5c6cff", py: 1.3 }}
        >
          Filtrar
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate("/novo-pacote")}
          sx={{ bgcolor: "#5c6cff", py: 1.3 }}
        >
          Criar Pacote
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
            {/* TÍTULO */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Título"
                value={filtros.titulo}
                onChange={(e) =>
                  setFiltros({ ...filtros, titulo: e.target.value })
                }
              />
            </Grid>

            {/* STATUS */}
            <Grid item xs={12} md={2}>
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

            {/* DATA INÍCIO */}
            <Grid item xs={12} md={3}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DatePicker
                  label="Início"
                  value={
                    filtros.periodoInicio ? dayjs(filtros.periodoInicio) : null
                  }
                  onChange={(v) =>
                    setFiltros({
                      ...filtros,
                      periodoInicio: v ? v.format("YYYY-MM-DD") : "",
                    })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            {/* DATA FIM */}
            <Grid item xs={12} md={3}>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <DatePicker
                  label="Término"
                  value={filtros.periodoFim ? dayjs(filtros.periodoFim) : null}
                  onChange={(v) =>
                    setFiltros({
                      ...filtros,
                      periodoFim: v ? v.format("YYYY-MM-DD") : "",
                    })
                  }
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            {/* BOTÃO */}
            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <Button
                onClick={buscarEmpreitadas}
                variant="contained"
                sx={{ bgcolor: "#5c6cff", py: 1.3 }}
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Collapse>

      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        loading={loading}
        getRowHeight={(params) => (params.model.isDetail ? "auto" : null)}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
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
        disableRowSelectionOnClick
      />
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Paper
            sx={{
              width: "80%",
              maxHeight: "80vh",
              p: 3,
              borderRadius: 2,
              overflow: "auto",
            }}
          >
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography variant="h6" fontWeight={600}>
                {selectedRow?.titulo}
              </Typography>

              <IconButton onClick={() => setOpenModal(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* GRID FILHO */}
            <DataGrid
              rows={detalhesSelecionados}
              columns={columnsDetalhes}
              autoHeight
              loading={loadingDetalhes}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              hideFooter
              sx={{
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                },
                "& .cor-background-headerName": {
                  backgroundColor: "#E0E7FF",
                },
              }}
            />
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
}
