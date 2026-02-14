import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import FilterListIcon from "@mui/icons-material/FilterList";

import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";

type DocumentoRow = {
  id: number;
  nome: string;
  descricao: string;
  processo: string;
  data: string;
  tamanho: string;
  tipo: string;
};
export default function DocumentosPage() {
  const [busca, setBusca] = useState("");

  const rows: DocumentoRow[] = [
    {
      id: 1,
      nome: "Sentença_Procedente_Parte.pdf",
      descricao: "Cálculo de liquidação pendente",
      processo: "0012345-88.2023",
      data: "14 Out, 10:30",
      tamanho: "2.4 MB",
      tipo: "pdf",
    },
    {
      id: 2,
      nome: "Planilha_Calculos_Atualizada_v2.xlsx",
      descricao: "Atualização IPCA-E + Juros",
      processo: "0012345-88.2023",
      data: "14 Out, 09:15",
      tamanho: "850 KB",
      tipo: "xls",
    },
    {
      id: 3,
      nome: "Petição_Inicial_Protocolada.docx",
      descricao: "Ação Civil Pública",
      processo: "0045678-12.2023",
      data: "13 Out, 16:45",
      tamanho: "1.1 MB",
      tipo: "doc",
    },
  ];

  const getIcon = (tipo: string) => {
    if (tipo === "pdf")
      return <PictureAsPdfIcon sx={{ color: "#DC2626", mr: 1 }} />;
    if (tipo === "xls")
      return <TableChartIcon sx={{ color: "#16A34A", mr: 1 }} />;
    return <DescriptionIcon sx={{ color: "#2563EB", mr: 1 }} />;
  };

  const columns: GridColDef<DocumentoRow>[] = [
    {
      field: "nome",
      headerName: "Documento",
      flex: 2,
      headerClassName: "cor-background-headerName",
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          {getIcon(params.row.tipo)}
          <Box>
            <Typography fontSize={14} fontWeight={500}>
              {params.row.nome}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              {params.row.descricao}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "processo",
      headerName: "Processo",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "data",
      headerName: "Data",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "tamanho",
      headerName: "Tam.",
      flex: 0.7,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "acoes",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      headerClassName: "cor-background-headerName",
      renderCell: () => (
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      ),
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
            Busca de Documentos
          </Typography>
          <Typography color="text.secondary">
            Gerencie e encontre arquivos rapidamente.
          </Typography>
        </Grid>
      </Grid>

      {/* CAMPO DE BUSCA GRANDE ESTILO IMAGEM */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Buscar por nº do processo, título ou conteúdo... (Cmd+K)"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          sx={{
            backgroundColor: "#F3F4F6",
            borderRadius: 2,
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
      <Box
        display="flex"
        justifyContent={{ xs: "flex-start", md: "flex-end" }}
        mt={{ marginBottom: "5px" }}
      >
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          sx={{ bgcolor: "#5c6cff", py: 1.3 }}
        >
          Filtrar
        </Button>
      </Box>

      {/* TABELA (MESMO PADRÃO DA SUA PROCESSO PAGE) */}
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
          disableRowSelectionOnClick
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
              backgroundColor: "#b1b8f8ff",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#F3F4F6",
            },
          }}
        />
      </Box>
    </Box>
  );
}
