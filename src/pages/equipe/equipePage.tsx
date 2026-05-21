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
import { Checkbox, FormControlLabel } from "@mui/material";

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

export default function EquipePage() {
  const [rows, setRows] = useState<TEquipe[]>([]);
  const [membros, setMembros] = useState<any[]>([]);
  const [loadingMembros, setLoadingMembros] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [equipesSelect, setEquipesSelect] = useState<TEquipe[]>([]);
  const [equipeSelecionada, setEquipeSelecionada] = useState<number | "">("");
  const [nomeEquipeSelecionada, setNomeEquipeSelecionada] = useState("");

  const [termoBusca, setTermoBusca] = useState("");
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [pessoasSelecionadas, setPessoasSelecionadas] = useState<number[]>([]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensagemSnackbar, setMensagemSnackbar] = useState("");
  const [tipoSnackbar, setTipoSnackbar] = useState<"success" | "error">(
    "success",
  );

  const [openConfirm, setOpenConfirm] = useState(false);
  const [membroParaExcluir, setMembroParaExcluir] = useState<number | null>(
    null,
  );

  const { data: idEntidadeWork } = useGetEntidadeWork();

  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>({
    type: "include",
    ids: new Set(),
  });
  const [maturidades, setMaturidades] = useState<any[]>([]);
  const [maturidadeSelecionada, setMaturidadeSelecionada] = useState<
    number | ""
  >("");

  const [risco, setRisco] = useState(0);
  const [execucao, setExecucao] = useState(0);

  // substitui maxProcessos
  const [metaDiaria, setMetaDiaria] = useState<number>(0);
  const [metaMensal, setMetaMensal] = useState<number>(0);
  const [loadingBusca, setLoadingBusca] = useState(false);

  const navigate = useNavigate();

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
        metaMensal: item?.metaMensal,
        metaDiaria: item.metaDiaria,
        maturidade: item.maturidade?.titulo,
        maturidadeId: Number(item.maturidade?.id),
        telefone: item.membro?.telefone,
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
    try {
      await Promise.all(
        pessoasSelecionadas.map((pessoaId) =>
          api.post("/api/v1/membro-equipe", {
            equipe: equipeSelecionada,
            membro: pessoaId,
            maturidade: maturidadeSelecionada,
            metaDiaria: metaDiaria,
            metaMensal: metaMensal,
            risco: risco,
            execucao: execucao,
          }),
        ),
      );

      setMensagemSnackbar("Membros incluídos com sucesso!");
      setTipoSnackbar("success");
      setOpenSnackbar(true);

      setOpenModal(false);
      setPessoasSelecionadas([]);
      setMetaDiaria(0);
      setMetaMensal(0);
      setMaturidadeSelecionada("");
      setRisco(0);
      setExecucao(0);
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
      headerClassName: "cor-background-headerName",
    },
    {
      field: "nome",
      headerName: "Nome",
      flex: 1,
      headerClassName: "cor-background-headerName",
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
      field: "nome",
      headerName: "Nome",
      flex: 0.8,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "metaDiaria",
      headerName: "Meta D",
      flex: 0.5,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "metaMensal",
      headerName: "Meta M.",
      flex: 0.5,
      headerClassName: "cor-background-headerName",
    },
    {
      field: "maturidade",
      headerName: "Senioridade",
      flex: 0.8,
      headerClassName: "cor-background-headerName",
      renderCell: (params) => {
        const isRoxo = Number(params.row.maturidadeId) === 5;

        return (
          <span
            style={{
              color: isRoxo ? "#30B2E4" : "inherit",
              fontWeight: isRoxo ? 600 : 400,
            }}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "telefone",
      headerName: "Telefone",
      flex: 0.8,
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
            onClick={() => navigate(`/membro-equipe/${params.row.id}/editar`)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
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
      headerClassName: "cor-background-headerName",
    },
  ];
  const abrirModal = async () => {
    setOpenModal(true);

    try {
      const [equipesRes, maturidadeRes] = await Promise.all([
        api.get("/api/v1/equipe", { params: { page: 0, size: 100 } }),
        api.get("/api/v1/equipe-maturidade", {
          params: { page: 0, size: 100 },
        }),
      ]);

      setEquipesSelect(
        equipesRes.data?.elements.map((item: any) => ({
          id: item.id,
          titulo: item.titulo,
        })),
      );

      setMaturidades(
        maturidadeRes.data?.elements.map((item: any) => ({
          id: item.id,
          titulo: item.titulo,
        })),
      );
    } catch (e) {
      console.error("Erro ao carregar dados");
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
            Equipe
          </Typography>
          <Typography color="text.secondary">Gernciamento de Equipe</Typography>
        </Grid>
        <Grid container spacing={2}>
          {/* ESQUERDA - EQUIPES */}
          <Grid item xs={12} md={4}>
            <Box
              mb={2}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                sx={{ bgcolor: "#30B2E4", px: 4, height: "50px" }}
                onClick={() => navigate("/equipe/nova")}
              >
                Adicionar Equipe
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
                <Typography variant="body2" color="text.primary" fontSize={20}>
                  Membros:
                </Typography>

                <Typography variant="h5" fontWeight={600} color="text.primary">
                  {nomeEquipeSelecionada}
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{ bgcolor: "#30B2E4", px: 4, height: "50px" }}
                onClick={abrirModal}
              >
                Adicionar Membro
              </Button>
            </Box>
            <DataGrid
              rows={membros}
              columns={columnsMembros}
              loading={loadingMembros}
              autoHeight
              disableRowSelectionOnClick
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              pageSizeOptions={[10]}
              getRowClassName={(params) =>
                Number(params.row.maturidadeId) === 5 ? "linha-roxa" : ""
              }
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
            <Button
              variant="contained"
              onClick={buscarPessoas}
              sx={{ bgcolor: "#30B2E4" }}
            >
              Buscar
            </Button>
          </Box>

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
              // sx={{
              //   "& .MuiDataGrid-row.Mui-selected": {
              //     backgroundColor: "#e3f2fd !important",
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
          </Box>

          {/* INPUT MAX PROCESSOS */}
          <Box display="flex" flexDirection={"column"} gap={1}>
            <Box display="flex" gap={2} mb={2}>
              {/* MATURIDADE */}
              <TextField
                select
                fullWidth
                label="Senioridade"
                value={maturidadeSelecionada}
                onChange={(e) =>
                  setMaturidadeSelecionada(Number(e.target.value))
                }
              >
                {maturidades.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.titulo}
                  </MenuItem>
                ))}
              </TextField>

              {/* META DIÁRIA */}
              <TextField
                label="Meta Diaria"
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

              {/* META MENSAL */}
              <TextField
                label="Meta Mensal"
                value={metaMensal}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setMetaMensal(value);

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
            <Box display="flex" gap={4} mb={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={risco === 1}
                    onChange={(e) => setRisco(e.target.checked ? 1 : 0)}
                  />
                }
                sx={{ color: "black" }}
                label="Risco"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={execucao === 1}
                    onChange={(e) => setExecucao(e.target.checked ? 1 : 0)}
                  />
                }
                label="Execução"
                sx={{ color: "black" }}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={incluirMembro}
                disabled={
                  pessoasSelecionadas.length === 0 ||
                  !equipeSelecionada ||
                  !maturidadeSelecionada
                }
                sx={{ bgcolor: "#30B2E4", width: "150px" }}
              >
                Incluir
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Modal open={openConfirm} onClose={() => setOpenConfirm(false)}>
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
