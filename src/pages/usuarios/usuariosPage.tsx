import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/GridLegacy";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";
import { useState } from "react";
import api from "../../api/axios";

interface TUsuario {
  id: number;
  nome: string;
  email: string;
}

interface PessoaFisicaResponse {
  totalElements: number;
  pageSize: number;
  totalPages: number;
  elements: {
    id: number;
    nome: string;
    entidade?: {
      nomeSocial?: string;
    };
  }[];
}

export default function UsuariosPage() {
  const [busca, setBusca] = useState("");
  const [rows, setRows] = useState<TUsuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<TUsuario | null>(null);

  const entidadePai = localStorage.getItem("idEntidadeUsuarioLogado");

  console.log("EntidadePai", entidadePai);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: TUsuario,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleVincularEquipe = () => {
    console.log("Vincular equipe:", selectedRow);
    handleCloseMenu();
  };

  const open = Boolean(anchorEl);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "nome",
      headerName: "Nome",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "email",
      headerName: "Email",
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

  const handleBuscar = async () => {
    try {
      setLoading(true);

      const response = await api.get<PessoaFisicaResponse>(
        "/api/v1/pessoa_fisica",
        {
          params: {
            entidade_pai: entidadePai,
            page: 0,
            size: 10,
          },
        },
      );

      const usuarios = (response.data?.elements || []).map((item) => ({
        id: item.id,
        nome: item.nome,
        email: item.entidade?.nomeSocial || "-",
      }));

      setRows(usuarios);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

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
            Usuários
          </Typography>
          <Typography color="text.secondary">
            Localize usuários cadastrados.
          </Typography>
        </Grid>
      </Grid>

      {/* CAMPO DE BUSCA */}
      <Box
        mb={2}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LADO ESQUERDO (campo + buscar) */}
        <Box sx={{ display: "flex", gap: "5px" }}>
          <TextField
            placeholder="Buscar usuários..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            sx={{
              backgroundColor: "#F3F4F6",
              borderRadius: 2,
              width: "600px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            onClick={handleBuscar}
            disabled={loading}
            sx={{
              bgcolor: "#5c6cff",
              px: 7,
              height: "55px",
            }}
          >
            Buscar
          </Button>
        </Box>

        {/* LADO DIREITO (novo botão) */}
        <Button
          variant="contained"
          sx={{
            bgcolor: "#5c6cff",
            px: 5,
            height: "55px",
          }}
          onClick={() => console.log("Adicionar usuário")}
        >
          Adicionar Usuário
        </Button>
      </Box>

      {/* TABELA */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          pageSizeOptions={[10]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
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
          <MenuItem onClick={handleVincularEquipe}>Vincular Equipe</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
