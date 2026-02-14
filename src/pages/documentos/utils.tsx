import { Box, Typography, IconButton } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { GridColDef } from "@mui/x-data-grid";
import type { TDocumento } from "./types";

const getIcon = (tipo: string) => {
  if (tipo === "pdf")
    return <PictureAsPdfIcon sx={{ color: "#DC2626", mr: 1 }} />;
  if (tipo === "xls")
    return <TableChartIcon sx={{ color: "#16A34A", mr: 1 }} />;
  return <DescriptionIcon sx={{ color: "#2563EB", mr: 1 }} />;
};

export const Columns: GridColDef<TDocumento>[] = [
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
