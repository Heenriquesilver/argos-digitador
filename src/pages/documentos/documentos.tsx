import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import type { TDocumento } from "./types";
import Grid from "@mui/material/GridLegacy";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import { Columns } from "./utils";

export default function DocumentosPage() {
  const [busca, setBusca] = useState("");

  const rows: TDocumento[] = [
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
          columns={Columns}
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
              backgroundColor: "#E0E7FF",
            },
          }}
        />
      </Box>
    </Box>
  );
}
