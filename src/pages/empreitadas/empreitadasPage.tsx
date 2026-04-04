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
import useGetEntidadeWork from "../../api/hooks/useGetEntidadeWork";
import { useState, useEffect } from "react";

import api from "../../api/axios";

type TEquipe = {
  id: number;
  titulo: string;
};

export default function EmpreitadasPage() {
  const [rows, setRows] = useState<TEquipe[]>([]);
  const [membros, setMembros] = useState<any[]>([]);
  const [loadingMembros, setLoadingMembros] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [equipesSelect] = useState<TEquipe[]>([]);
  const [equipeSelecionada, setEquipeSelecionada] = useState<number | "">("");
  const [nomeEquipeSelecionada, setNomeEquipeSelecionada] = useState("");
  const [erroMaxProcessos, setErroMaxProcessos] = useState("");

  const [termoBusca, setTermoBusca] = useState("");
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [pessoasSelecionadas, setPessoasSelecionadas] = useState<number[]>([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensagemSnackbar, setMensagemSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState<"success" | "error">(
    "success",
  );

  const { data: idEntidadeWork } = useGetEntidadeWork();

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });
  const [maxProcessos, setMaxProcessos] = useState<number>(0);
  const [loadingBusca, setLoadingBusca] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        setLoading(true);

        const response = await api.get("/api/v1/equipe", {
          params: {
            page: 0,
            size: 10,
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

  const fetchMembros = async (id: number) => {
    try {
      setLoadingMembros(true);

      const response = await api.get(`/api/v1/membro-equipe/equipe/${id}`, {
        params: {
          page: 0,
          size: 10,
        },
      });

      const data = response.data?.elements || [];

      const formatted = data.map((item: any) => ({
        id: item.id,
        nome: item.membro?.nome,
        cpf: item.membro?.cpf,
        telefone: item.membro?.telefone,
        maxProcessosAlocados: item.maxProcessosAlocados,
      }));

      setMembros(formatted);
    } catch (error) {
      console.error("Erro ao buscar membros", error);
    } finally {
      setLoadingMembros(false);
    }
  };

  const deletarMembro = async (id: number) => {
    try {
      await api.delete(`/api/v1/membro-equipe/${id}`);

      setMensagemSnackbar("Membro removido com sucesso!");
      setTipoSnackbar("success");
      setOpenSnackbar(true);

      setMembros((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Erro ao remover membro", error);

      setMensagemSnackbar("Erro ao remover membro");
      setTipoSnackbar("error");
      setOpenSnackbar(true);
    }
  };

  const buscarPessoas = async () => {
    try {
      setLoadingBusca(true);

      const entidade = idEntidadeWork;

      const response = await api.get("/api/v1/pessoa_fisica/termo", {
        params: {
          entidade_pai: entidade,
          termo: termoBusca,
          page: 0,
          size: 10,
        },
      });

      const data = response.data?.elements || [];

      setPessoas(
        data.map((item: any) => ({
          id: item.id,
          nome: item.nome,
        })),
      );
    } catch (e) {
      console.error("Erro ao buscar pessoas");
    } finally {
      setLoadingBusca(false);
    }
  };

  const incluirMembro = async () => {
    if (!maxProcessos || maxProcessos <= 0) {
      setErroMaxProcessos("O valor deve ser maior que 0");
      return;
    }

    try {
      await Promise.all(
        pessoasSelecionadas.map((pessoaId) =>
          api.post("/api/v1/membro-equipe", {
            equipe: equipeSelecionada,
            membro: pessoaId,
            maxProcessosAlocados: maxProcessos,
          }),
        ),
      );

      setMensagemSnackbar("Membros incluídos com sucesso!");
      setTipoSnackbar("success");
      setOpenSnackbar(true);

      setOpenModal(false);
      setPessoasSelecionadas([]);
      setMaxProcessos(0);
      setTermoBusca("");
    } catch (e) {
      setMensagemSnackbar("Erro ao incluir membros");
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
      width: 300,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "acoes",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      flex: 1,
      minWidth: 200,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <Box
          display="flex"
          gap={1}
          justifyContent="flex-end" // 👈 alinha à direita
          alignItems="center"
          width="100%" // 👈 ocupa toda a célula
        >
          <IconButton
            size="small"
            onClick={() => {
              fetchMembros(params.row.id);
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

  const columnsPessoas: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
    },
    {
      field: "nome",
      headerName: "Nome",
      flex: 1,
    },
  ];

  const columnsMembros: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.2,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "maxProcessosAlocados",
      headerName: "Max. Processos",
      flex: 0.5,
      headerClassName: "cor-background-headerName",
    },

    {
      field: "nome",
      headerName: "Nome",
      flex: 1,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "cpf",
      headerName: "CPF",
      width: 150,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "telefone",
      headerName: "Telefone",
      width: 150,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "acoes",
      headerName: "Ações",
      sortable: false,
      filterable: false,
      flex: 1,
      minWidth: 200,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => (
        <Box
          display="flex"
          gap={1}
          justifyContent="flex-end" // 👈 alinha à direita
          alignItems="center"
          width="100%" // 👈 ocupa toda a célula
        >
          <IconButton size="small" onClick={() => deletarMembro(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
      headerClassName: "cor-background-headerName",
    },
  ];
  // const abrirModal = async () => {
  //   setOpenModal(true);

  //   try {
  //     const response = await api.get("/api/v1/equipe", {
  //       params: { page: 0, size: 100 },
  //     });

  //     const data = response.data?.elements || [];

  //     setEquipesSelect(
  //       data.map((item: any) => ({
  //         id: item.id,
  //         titulo: item.titulo,
  //       })),
  //     );
  //   } catch (e) {
  //     console.error("Erro ao carregar equipes");
  //   }
  // };

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
            Empreitada
          </Typography>
          <Typography color="text.secondary">
            Gernciamento de Pacotes de trabalho
          </Typography>
        </Grid>
        <Grid container spacing={2}>
          {/* ESQUERDA - EQUIPES */}
          <Grid item xs={12} md={6}>
            <Box
              mb={2}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Button
                variant="contained"
                sx={{ bgcolor: "#5c6cff", px: 4, height: "50px" }}
                onClick={() => navigate("/nova-empresa")}
              >
                Filtrar
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#5c6cff", px: 4, height: "50px" }}
                onClick={() => navigate("/novo-pacote")}
              >
                Criar Pacote
              </Button>
            </Box>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              autoHeight
              disableRowSelectionOnClick
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              pageSizeOptions={[10]}
            />
          </Grid>

          {/* DIREITA - MEMBROS */}
          <Grid item xs={12} md={6}>
            <Box
              mb={2}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" mb={2} color="text.primary">
                Calculos do Pacote {nomeEquipeSelecionada}
              </Typography>
              {/* <Button
                variant="contained"
                sx={{ bgcolor: "#5c6cff", px: 4, height: "50px" }}
                onClick={abrirModal}
              >
                Adicionar Membro
              </Button> */}
            </Box>
            <DataGrid
              rows={membros}
              columns={columnsMembros}
              loading={loadingMembros}
              autoHeight
              disableRowSelectionOnClick
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              pageSizeOptions={[10]}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* TABELA */}

      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectionModel({
            type: "include",
            ids: new Set(),
          });
          setPessoasSelecionadas([]);
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
              label="Buscar pessoa"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
            <Button variant="contained" onClick={buscarPessoas}>
              Buscar
            </Button>
          </Box>

          {/* LISTA DE PESSOAS */}
          <Box sx={{ height: 250, mb: 2 }}>
            <DataGrid
              rows={pessoas}
              columns={columnsPessoas}
              loading={loadingBusca}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick={false}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={(newSelection) => {
                setSelectionModel(newSelection);

                const selectedIds = Array.from(newSelection.ids).map(Number);
                setPessoasSelecionadas(selectedIds);
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
            <TextField
              label="Máx. Processos"
              value={maxProcessos}
              onChange={(e) => {
                const value = Number(e.target.value);

                setMaxProcessos(value);

                if (!value || value <= 0) {
                  setErroMaxProcessos("O valor deve ser maior que 0");
                } else {
                  setErroMaxProcessos("");
                }
              }}
              error={!!erroMaxProcessos}
              helperText={erroMaxProcessos}
              inputProps={{ min: 1 }}
              sx={{ width: "150px" }}
            />
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={incluirMembro}
                disabled={
                  pessoasSelecionadas.length === 0 ||
                  !equipeSelecionada ||
                  maxProcessos <= 0 ||
                  !!erroMaxProcessos
                }
                sx={{ width: "150px" }}
              >
                Incluir
              </Button>
            </Box>
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
