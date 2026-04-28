import { Box, Button, IconButton, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import { useState } from "react";
import type { GridColDef } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";

type TDocumentosRow = {
  id: number;
  verba: string;
  data: string;
  usuario: string;
  valor: string;
  comentario: string;
};

const Pedidos = () => {
  const rows = [
    {
      id: 1,
      verba: "Cálculo Inicial",
      data: "24/10/2023 14:35",
      usuario: "Ana Souza",
      valor: "R$ 1.520,75",
      comentario: "Memória de cálculo anexada ao processo.",
    },
    {
      id: 2,
      verba: "Cálculo de Liquidação",
      data: "02/11/2023 09:12",
      usuario: "Carlos Pereira",
      valor: "R$ 3.845,20",
      comentario: "Atualização com juros e correção monetária.",
    },
    {
      id: 3,
      verba: "Cálculo Complementar",
      data: "15/11/2023 16:48",
      usuario: "Juliana Martins",
      valor: "R$ 980,40",
      comentario: "Inclusão de diferenças salariais apuradas.",
    },
    {
      id: 4,
      verba: "Atualização de Valores",
      data: "28/11/2023 10:05",
      usuario: "Roberto Lima",
      valor: "R$ 2.430,90",
      comentario: "Aplicação de índice de correção até a presente data.",
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
      field: "verba",
      headerName: "Verba",
      flex: 1.3,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "data",
      headerName: "Data",
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
      field: "valor",
      headerName: "Valor",
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
          Incluir
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "#5c6cff", py: 1.0 }}
          //   onClick={() => setOpenFilter(!openFilter)}
        >
          Excluir
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
        <MenuItem>Aprovar</MenuItem>
        <MenuItem>Rejeitar</MenuItem>
        <MenuItem>Comentar</MenuItem>
      </Menu>
    </Box>
  );
};

export default Pedidos;
