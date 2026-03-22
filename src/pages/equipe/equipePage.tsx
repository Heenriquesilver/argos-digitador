import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Checkbox,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Menu from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ptBR } from "@mui/x-data-grid/locales";
import Grid from "@mui/material/GridLegacy";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import api from "../../api/axios";

type TEquipe = {
  id: number;
  titulo: string;
};

export default function EquipePage() {
  const [rows, setRows] = useState<TEquipe[]>([]);
  const [membros, setMembros] = useState<any[]>([]);
  const [loadingMembros, setLoadingMembros] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        setLoading(true);

        const response = await api.get("/api/v1/equipe", {
          params: {
            page: 0,
            size: 10,
          },
        });

        const data = response.data?.elements || [];

        // 🔥 Mapeia pro formato do DataGrid
        const formatted = data.map((item: any) => ({
          id: item.id,
          titulo: item.titulo,
        }));

        setRows(formatted);
      } catch (error) {
        console.error("Erro ao buscar equipes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipes();
  }, []);

  const fetchMembros = async (id: number) => {
    try {
      setLoadingMembros(true);

      const response = await api.get(`/api/v1/membro-equipe/equipe/${id}`, {
        params: {
          page: 0,
          size: 10,
        },
      });

      const data = response.data?.elements || [];

      const formatted = data.map((item: any) => ({
        id: item.id,
        nome: item.membro?.nome,
        cpf: item.membro?.cpf,
        telefone: item.membro?.telefone,
      }));

      setMembros(formatted);
    } catch (error) {
      console.error("Erro ao buscar membros", error);
    } finally {
      setLoadingMembros(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "titulo",
      headerName: "Título",
      width: 300,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "acoes",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      flex: 1,
      minWidth: 200,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <Box
          display="flex"
          gap={1}
          justifyContent="flex-end" // 👈 alinha à direita
          alignItems="center"
          width="100%" // 👈 ocupa toda a célula
        >
          <IconButton size="small" onClick={() => fetchMembros(params.row.id)}>
            <GroupIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => navigate(`/equipe/${params.row.id}/editar`)}
          >
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => console.log("Remover:", params.row)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
      headerClassName: "cor-background-headerName",
    },
  ];

  const columnsMembros: GridColDef[] = [
    {
      field: "nome",
      headerName: "Nome",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "cpf",
      headerName: "CPF",
      width: 150,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "telefone",
      headerName: "Telefone",
      width: 150,
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
        p: 4,
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <Grid container alignItems="center" mb={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Equipe
          </Typography>
          <Typography color="text.secondary">Gernciamento de Equipe</Typography>
        </Grid>
      </Grid>

      {/* TABELA */}
      <Grid container spacing={2}>
        {/* ESQUERDA - EQUIPES */}
        <Grid item xs={12} md={6}>
          <Box
            mb={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" mb={2} color="text.primary">
              Equipes
            </Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff", px: 4, height: "50px" }}
              onClick={() => navigate("/nova-empresa")}
            >
              Adicionar Equipe
            </Button>
          </Box>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            autoHeight
            disableRowSelectionOnClick
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            pageSizeOptions={[10]}
          />
        </Grid>

        {/* DIREITA - MEMBROS */}
        <Grid item xs={12} md={6}>
          <Box
            mb={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" mb={2} color="text.primary">
              Membros da Equipe
            </Typography>
            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff", px: 4, height: "50px" }}
              onClick={() => navigate("/nova-empresa")}
            >
              Adicionar Membro
            </Button>
          </Box>
          <DataGrid
            rows={membros}
            columns={columnsMembros}
            loading={loadingMembros}
            autoHeight
            disableRowSelectionOnClick
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            pageSizeOptions={[10]}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
