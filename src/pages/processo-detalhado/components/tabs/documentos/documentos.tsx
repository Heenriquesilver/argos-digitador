import { Box, Button, IconButton, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";

type TDocumentosRow = {
  id: number;
  tipoDocumento: string;
  link: string;
  dataHora: string;
  usuario: string;
};

const Documentos = () => {
  const rows = [
    {
      id: 1,
      tipoDocumento: "Cálculo Inicial",
      link: "/documentos/LC-2023-099.pdf",
      dataHora: "24/10/2023 14:35",
      usuario: "Ana Souza",
    },
    {
      id: 2,
      tipoDocumento: "Petição Inicial",
      link: "/docs/peticao-inicial.pdf",
      dataHora: "22/10/2023 11:20",
      usuario: "Mariana Alves",
    },
    {
      id: 3,
      tipoDocumento: "Contestação",
      link: "/docs/contestacao.pdf",
      dataHora: "21/10/2023 16:45",
      usuario: "João Pereira",
    },
    {
      id: 4,
      tipoDocumento: "Planilha de Cálculo",
      link: "/docs/planilha-calculo.xlsx",
      dataHora: "20/10/2023 08:10",
      usuario: "Fernanda Rocha",
    },
  ];

  const columns: GridColDef<TDocumentosRow>[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.3,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "tipoDocumento",
      headerName: "Tipo Documento",
      flex: 1.3,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "link",
      headerName: "Link",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "dataHora",
      headerName: "Data-Hora",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "usuario",
      headerName: "Usuário",
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
      renderCell: () => (
        <IconButton size="small" onClick={(event) => handleOpenMenu(event)}>
          <MoreVertIcon />
        </IconButton>
      ),
      headerClassName: "cor-background-headerName",
    },
  ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        width: "100%",
      }}
    >
      <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
        <Button
          variant="contained"
          sx={{ bgcolor: "#5c6cff", py: 1.0 }}
          //   onClick={}
        >
          Incluir Documento
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#5c6cff", py: 1.0 }}
          //   onClick={() => setOpenFilter(!openFilter)}
        >
          Excluir Documento
        </Button>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
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
        <MenuItem>Visualizar</MenuItem>
      </Menu>
    </Box>
  );
};

export default Documentos;
