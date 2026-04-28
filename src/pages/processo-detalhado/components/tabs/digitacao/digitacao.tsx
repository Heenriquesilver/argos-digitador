import { Box, Button, IconButton, MenuItem, Typography } from "@mui/material";
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

type TTarefasRow = {
  id: number;
  descricao: string;
  prazo: string;
  calculista: string;
  digitador: string;
  status: string;
  dataHora: string;
};

const Digitacao = () => {
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

  const tarefasRows: TTarefasRow[] = [
    {
      id: 1,
      descricao: "Cálculo de liquidação",
      prazo: "05/03/2026",
      calculista: "Ana Souza",
      digitador: "Carlos Lima",
      status: "Em andamento",
      dataHora: "24/02/2026 09:30",
    },
    {
      id: 2,
      descricao: "Atualização de valores",
      prazo: "06/03/2026",
      calculista: "Bruno Alves",
      digitador: "Mariana Rocha",
      status: "Pendente",
      dataHora: "24/02/2026 10:15",
    },
    {
      id: 3,
      descricao: "Revisão de cálculos",
      prazo: "07/03/2026",
      calculista: "Fernanda Costa",
      digitador: "João Pedro",
      status: "Concluído",
      dataHora: "24/02/2026 11:40",
    },
    {
      id: 4,
      descricao: "Impugnação de valores",
      prazo: "10/03/2026",
      calculista: "Ricardo Nunes",
      digitador: "Patricia Gomes",
      status: "Em análise",
      dataHora: "24/02/2026 13:20",
    },
  ];

  const tarefasColumns: GridColDef<TTarefasRow>[] = [
    { field: "id", headerName: "ID", width: 80 },

    {
      field: "descricao",
      headerName: "Descrição",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "prazo",
      headerName: "Prazo",
      width: 120,
    },
    {
      field: "calculista",
      headerName: "Calculista",
      width: 160,
    },
    {
      field: "digitador",
      headerName: "Digitador",
      width: 160,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
    },
    {
      field: "dataHora",
      headerName: "Data/Hora",
      width: 180,
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
    <Box sx={{ display: "flex", gap: "5px" }}>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "50vh",
        }}
      >
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box>
            <Typography color="text.primary" variant="h4">
              Documentos
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "3px" }}>
            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff", py: 1.0 }}
              //   onClick={}
            >
              Adicionar
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff", py: 1.0 }}
              //   onClick={() => setOpenFilter(!openFilter)}
            >
              Remover
            </Button>
          </Box>
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
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "50vh",
        }}
      >
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box>
            <Typography color="text.primary" variant="h4">
              Tarefas
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "3px" }}>
            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff", py: 1.0 }}
              //   onClick={}
            >
              Adicionar
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff", py: 1.0 }}
              //   onClick={() => setOpenFilter(!openFilter)}
            >
              Remover
            </Button>
          </Box>
        </Box>

        <DataGrid
          rows={tarefasRows}
          columns={tarefasColumns}
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
    </Box>
  );
};

export default Digitacao;
