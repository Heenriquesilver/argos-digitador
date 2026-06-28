import { Box, Button, IconButton, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";

type TDocumentosRow = {
  id: number;
  tipoDocumento: string;
  link: string;
  dataHora: string;
  usuario: string;
};

const Documentos = () => {
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
          sx={{ bgcolor: "#0A1C30", height: "35px", marginTop: "9px" }}
          //   onClick={}
        >
          Incluir Documento
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#0A1C30", height: "35px", marginTop: "9px" }}
          //   onClick={() => setOpenFilter(!openFilter)}
        >
          Excluir Documento
        </Button>
      </Box>
      <DataGrid
        rows={[]}
        columns={columns}
        pageSizeOptions={[5]}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
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
        <MenuItem>Visualizar</MenuItem>
      </Menu>
    </Box>
  );
};

export default Documentos;
