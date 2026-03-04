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
import Menu from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ptBR } from "@mui/x-data-grid/locales";
import Grid from "@mui/material/GridLegacy";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../api/axios";

interface TEmpresa {
  id: number;
  nome: string;
  cnpj: string;
}

export default function EmpresasPage() {
  const [busca, setBusca] = useState("");
  const [buscarPorCnpj, setBuscarPorCnpj] = useState(false);
  const [rows, setRows] = useState<TEmpresa[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<TEmpresa | null>(null);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: TEmpresa,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleRecusar = () => {
    console.log("Processo recusado:", selectedRow);
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
      field: "cnpj",
      headerName: "CNPJ",
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
    if (!busca.trim()) return;

    try {
      setLoading(true);

      const endpoint = buscarPorCnpj
        ? "/api/v1/pessoa_juridica/cnpj"
        : "/api/v1/pessoa_juridica/nome";

      const paramName = buscarPorCnpj ? "cnpj" : "nome";

      const response = await api.get(endpoint, {
        params: {
          [paramName]: busca,
          page: 0,
          size: 10,
        },
      });

      const empresas = response.data.elements.map((item: any) => ({
        id: item.id,
        nome: item.nomeFantasia || item.razaoSocial,
        cnpj: item.cnpj,
      }));

      setRows(empresas);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
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
            Empresas
          </Typography>
          <Typography color="text.secondary">
            Localize empresas por nome ou CNPJ.
          </Typography>
        </Grid>
      </Grid>

      {/* CAMPO DE BUSCA */}
      <Box mb={2} sx={{ display: "flex", gap: "5px" }}>
        <Box>
          <TextField
            fullWidth
            placeholder={
              buscarPorCnpj ? "Digite o CNPJ..." : "Digite o nome da empresa..."
            }
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
        </Box>
        <Box>
          <Button
            variant="contained"
            onClick={handleBuscar}
            disabled={loading}
            sx={{
              bgcolor: "#5c6cff",
              px: 7,
              height: "55px",
              margin: "0 auto",
            }}
          >
            Buscar
          </Button>
        </Box>
      </Box>

      {/* CHECKBOX */}
      <Box mb={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={buscarPorCnpj}
              onChange={(e) => setBuscarPorCnpj(e.target.checked)}
            />
          }
          label="Buscar por CNPJ"
          sx={{ color: "black" }}
        />
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
          <MenuItem onClick={() => alert("okey")}>Tornar Cliente</MenuItem>
          <MenuItem onClick={handleRecusar}>Criar Campanha de Lead</MenuItem>
          <MenuItem onClick={() => alert("okey")}>Inativar</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
