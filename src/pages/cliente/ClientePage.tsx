import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Modal,
  MenuItem,
} from "@mui/material";

import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { GridRowSelectionModel } from "@mui/x-data-grid";
import { Snackbar, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { ptBR } from "@mui/x-data-grid/locales";
import Grid from "@mui/material/GridLegacy";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
// import useGetEntidadeWork from "../../api/hooks/useGetEntidadeWork";
import { useState, useEffect } from "react";

import api from "../../api/axios";

type TEquipe = {
  id: number;
  titulo: string;
};

export default function ClientePage() {
  const [rows, setRows] = useState<TEquipe[]>([]);
  const [membros, setMembros] = useState<any[]>([]);
  const [loadingMembros, setLoadingMembros] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [equipesSelect, setEquipesSelect] = useState<TEquipe[]>([]);
  const [equipeSelecionada, setEquipeSelecionada] = useState<number | "">("");
  const [nomeEquipeSelecionada, setNomeEquipeSelecionada] = useState("");

  const [termoBusca, setTermoBusca] = useState("");
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [empresasSelecionadas, setEmpresasSelecionadas] = useState<number[]>(
    [],
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensagemSnackbar, setMensagemSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState<"success" | "error">(
    "success",
  );

  const [openConfirm, setOpenConfirm] = useState(false);
  const [membroParaExcluir, setMembroParaExcluir] = useState<number | null>(
    null,
  );

  // const { data: idEntidadeWork } = useGetEntidadeWork();

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });

  // substitui maxProcessos
  const [metaDiaria, setMetaDiaria] = useState<number>(0);

  const [loadingBusca, setLoadingBusca] = useState(false);

  const navigate = useNavigate();

  const buscarEmpresas = async () => {
    if (!termoBusca.trim()) return;

    try {
      setLoadingBusca(true);

      const response = await api.get("/api/v1/pessoa_juridica/nome", {
        params: {
          nome: termoBusca,
          page: 0,
          size: 10,
        },
      });

      const data = response.data?.elements || [];

      setEmpresas(
        data.map((item: any) => ({
          id: item.id,
          nome: item.nomeFantasia || item.razaoSocial,
          cnpj: item.cnpj,
          cidade: item.cidade,
          uf: item.uf,
        })),
      );
    } catch (e) {
      console.error("Erro ao buscar empresas");
      setEmpresas([]);
    } finally {
      setLoadingBusca(false);
    }
  };

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        setLoading(true);

        const response = await api.get("/api/v1/equipe", {
          params: {
            page: 0,
            size: 20,
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

  const fetchClientes = async (id: number) => {
    try {
      setLoadingMembros(true);

      const response = await api.get(`/api/v1/cliente-equipe/equipe/${id}`, {
        // params: {
        //   page: 0,
        //   size: 10,
        // },
      });

      const data = response.data?.elements || [];

      const formatted = data.map((item: any) => ({
        id: item.id, // 👈 ID da relação cliente-equipe (ideal pra delete)
        idReal: item.cliente?.id ?? null,
        nome: item.cliente?.nomeFantasia,
        cnpj: item.cliente?.cnpj,
        cidade: item.cliente?.cidade,
        uf: item.cliente?.uf,
      }));

      setMembros(formatted);
    } catch (error) {
      console.error("Erro ao buscar clientes", error);
    } finally {
      setLoadingMembros(false);
    }
  };

  const deletarMembro = async (id: number) => {
    try {
      await api.delete(`/api/v1/cliente-equipe/${id}`);

      setMensagemSnackbar("Cliente removido da equipe com sucesso!");
      setTipoSnackbar("success");
      setOpenSnackbar(true);

      setMembros((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Erro ao remover cliente", error);

      setMensagemSnackbar("Erro ao remover cliente");
      setTipoSnackbar("error");
      setOpenSnackbar(true);
    }
  };

  const incluirMembro = async () => {
    try {
      await Promise.all(
        empresasSelecionadas.map((empresaId) =>
          api.post("/api/v1/cliente-equipe", {
            cliente: empresaId,
            equipe: equipeSelecionada,
            numr_externo: String(metaDiaria),
          }),
        ),
      );

      setMensagemSnackbar("Clientes incluídos com sucesso!");
      setTipoSnackbar("success");
      setOpenSnackbar(true);

      setOpenModal(false);
      setEmpresasSelecionadas([]);
      setMetaDiaria(0);
    } catch (e) {
      setMensagemSnackbar("Erro ao incluir clientes");
      setTipoSnackbar("error");
      setOpenSnackbar(true);
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
      width: 200,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "acoes",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      flex: 1,
      minWidth: 100,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <Box
          display="flex"
          gap={1}
          justifyContent="flex-end"
          alignItems="center"
          width="100%"
        >
          <IconButton
            size="small"
            onClick={() => {
              fetchClientes(params.row.id);
              setNomeEquipeSelecionada(params.row.titulo);
            }}
          >
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

  const columnsEmpresas: GridColDef[] = [
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
      field: "cidade",
      headerName: "Cidade",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "uf",
      headerName: "UF",
      width: 90,
      headerClassName: "cor-background-headerName",
    },
  ];

  const columnsClientes: GridColDef[] = [
    {
      field: "idReal",
      headerName: "ID",
      flex: 0.3,
      headerClassName: "cor-background-headerName",
      renderCell: (params) => params.value ?? "",
    },
    {
      field: "nome",
      headerName: "Nome Fantasia",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "cnpj",
      headerName: "CNPJ",
      flex: 0.8,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "cidade",
      headerName: "Cidade",
      flex: 0.6,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "uf",
      headerName: "UF",
      flex: 0.3,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "acoes",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      flex: 0.4,
      align: "right",
      headerAlign: "right",
      headerClassName: "cor-background-headerName",
      renderCell: (params) => (
        <Box
          display="flex"
          gap={1}
          justifyContent="flex-end"
          alignItems="center"
          width="100%"
        >
          <IconButton
            size="small"
            onClick={() => {
              setMembroParaExcluir(params.row.id);
              setOpenConfirm(true);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const abrirModal = async () => {
    setOpenModal(true);

    try {
      const response = await api.get("/api/v1/equipe", {
        params: { page: 0, size: 100 },
      });

      setEquipesSelect(
        response.data?.elements.map((item: any) => ({
          id: item.id,
          titulo: item.titulo,
        })),
      );
    } catch (e) {
      console.error("Erro ao carregar equipes");
    }
  };

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
            Clientes Por Equipe
          </Typography>
          <Typography color="text.secondary">
            Gernciamento de Clientes
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          {/* ESQUERDA - EQUIPES */}
          <Grid item xs={12} md={4} mt={2.5}>
            <Box
              mb={2}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}></Box>
              <Typography variant="body2" color="text.primary" fontSize={20}>
                Equipe
              </Typography>
            </Box>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              autoHeight
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
                  color: "white",
                },
                "& .cor-background-headerName": {
                  backgroundColor: "#0A1C30",
                },
                "& .MuiDataGrid-columnHeaderCheckbox": {
                  backgroundColor: "#E0E7FF",
                },
              }}
            />
          </Grid>

          {/* DIREITA - MEMBROS */}
          <Grid item xs={12} md={8}>
            <Box
              mb={2}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  color="text.primary"
                  fontSize={20}
                  mt={2.5}
                >
                  Clientes:
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={600}
                  color="text.primary"
                  mt={2}
                >
                  {nomeEquipeSelecionada}
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{ bgcolor: "#30B2E4", px: 4, height: "50px" }}
                onClick={abrirModal}
              >
                Adicionar Cliente
              </Button>
            </Box>
            <DataGrid
              rows={membros}
              columns={columnsClientes}
              loading={loadingMembros}
              autoHeight
              disableRowSelectionOnClick
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              pageSizeOptions={[10]}
              // getRowClassName={(params) =>
              //   Number(params.row.maturidadeId) === 5 ? "linha-roxa" : ""
              // }
              // sx={{
              //   "& .linha-roxa": {
              //     color: "#5c6cff",
              //     fontWeight: 600,
              //   },
              // }}
              sx={{
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                  color: "white",
                },
                "& .cor-background-headerName": {
                  backgroundColor: "#0A1C30",
                },
              }}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* TABELA */}

      <Modal
        open={openModal}
        onClose={() => {
          setOpenConfirm(false);
          setSelectionModel({
            type: "include",
            ids: new Set(),
          });
          setEmpresasSelecionadas([]);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "#fff",
            p: 4,
            borderRadius: 2,
          }}
        >
          {/* BOTÃO FECHAR */}
          <IconButton
            onClick={() => {
              setOpenModal(false);
              setSelectionModel({
                type: "include",
                ids: new Set(),
              });
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" mb={2}>
            Adicionar Membro
          </Typography>

          {/* SELECT EQUIPE */}
          <TextField
            select
            fullWidth
            label="Equipe"
            value={equipeSelecionada}
            onChange={(e) => setEquipeSelecionada(Number(e.target.value))}
            sx={{ mb: 2 }}
          >
            {equipesSelect.map((eq) => (
              <MenuItem key={eq.id} value={eq.id}>
                {eq.titulo}
              </MenuItem>
            ))}
          </TextField>

          {/* BUSCA */}
          <Box display="flex" gap={1} mb={2}>
            <TextField
              fullWidth
              label="Buscar Empresa"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={buscarEmpresas}
              sx={{ bgcolor: "#30B2E4" }}
            >
              Buscar
            </Button>
          </Box>

          {/* LISTA DE PESSOAS */}
          <Box sx={{ height: 250, mb: 2 }}>
            <DataGrid
              rows={empresas}
              columns={columnsEmpresas}
              loading={loadingBusca}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick={false}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection);

                const selectedIds = Array.from(newSelection.ids).map(Number);
                setEmpresasSelecionadas(selectedIds);
              }}
              sx={{
                "& .MuiDataGrid-row.Mui-selected": {
                  backgroundColor: "#e3f2fd !important",
                },
              }}
            />
          </Box>

          {/* INPUT MAX PROCESSOS */}
          <Box display="flex" flexDirection={"column"} gap={1}>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Id Externo "
                value={metaDiaria}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setMetaDiaria(value);

                  // if (!value || value <= 0) {
                  //   setErroMaxProcessos("O valor deve ser maior que 0");
                  // } else {
                  //   setErroMaxProcessos("");
                  // }
                }}
                // error={!!erroMaxProcessos}
                // helperText={erroMaxProcessos}
                // inputProps={{ min: 1 }}
                sx={{ width: "150px" }}
              />
            </Box>

            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={incluirMembro}
                disabled={
                  empresasSelecionadas.length === 0 || !equipeSelecionada
                }
                sx={{ bgcolor: "#30B2E4", width: "150px" }}
              >
                Incluir
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openConfirm}
        onClose={() => {
          setOpenModal(false);
          setSelectionModel({
            type: "include",
            ids: new Set(),
          });
          setEmpresasSelecionadas([]);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#fff",
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2} color="text.primary">
            Confirmar exclusão
          </Typography>

          <Typography mb={3} color="text.primary">
            Tem certeza que deseja remover este membro?
          </Typography>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setOpenConfirm(false)}>Cancelar</Button>

            <Button
              variant="contained"
              color="error"
              onClick={() => {
                if (membroParaExcluir) {
                  deletarMembro(membroParaExcluir);
                }
                setOpenConfirm(false);
                setMembroParaExcluir(null);
              }}
            >
              Excluir
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={tipoSnackbar}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {mensagemSnackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
}
