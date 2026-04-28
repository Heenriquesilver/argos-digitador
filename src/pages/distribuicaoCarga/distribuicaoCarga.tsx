import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
  Paper,
  Avatar,
  LinearProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import GraficoDistribuicao from "../../components/grafico-distribuicao-carga/graficoDistribuicao";
import MetricCard from "../../components/MetricCard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SnackInfo from "../../components/snack-info/SnackInfo";

import { useLocation } from "react-router-dom";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Grid from "@mui/material/GridLegacy";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import useGetEntidadeWork from "../../api/hooks/useGetEntidadeWork";
import api from "../../api/axios";

import { useState, useEffect } from "react";

type Tprocesso = {
  id: number;
  processoJudicial: string;
  status: number;
  responsavel: number;
  prioridade: number;
  alocacao: string;
  inicio: number;
  termino: number;
  prazo: string;
  observacao: number;
};

export default function DistribuicaoCarga() {
  // const [pessoas, setPessoas] = useState<any[]>([]);

  const [equipes, setEquipes] = useState<any[]>([]);
  const [equipeSelecionada, setEquipeSelecionada] = useState<number | null>(
    null,
  );
  const [membrosEquipe, setMembrosEquipe] = useState<any[]>([]);
  const [membroSelecionado, setMembroSelecionado] = useState("");

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackType, setSnackType] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const showSnack = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setSnackMessage(message);
    setSnackType(type);
    setSnackOpen(true);
  };

  // const { data: idEntidadeWork } = useGetEntidadeWork();

  const location = useLocation();

  const [processos, setProcessos] = useState<Tprocesso[]>(
    (location.state?.processos as Tprocesso[]) || [],
  );

  const equipe = [
    {
      id: 1,
      nome: "Ricardo Silva",
      cargo: "Calculista Sênior",
      carga: 3,
      total: 6,
      status: "Disponível",
    },
    {
      id: 2,
      nome: "Ana Carolina",
      cargo: "Calculista Pleno",
      carga: 5,
      total: 6,
      status: "Limite Próximo",
    },
    {
      id: 3,
      nome: "Marcos Lima",
      cargo: "Calculista Júnior",
      carga: 2,
      total: 6,
      status: "Disponível",
    },
    {
      id: 4,
      nome: "Fernanda Souza",
      cargo: "Calculista Pleno",
      carga: 4,
      total: 6,
      status: "Limite Próximo",
    },
    {
      id: 5,
      nome: "Carlos Mendes",
      cargo: "Calculista Sênior",
      carga: 1,
      total: 6,
      status: "Disponível",
    },
    {
      id: 6,
      nome: "Juliana Alves",
      cargo: "Calculista Júnior",
      carga: 6,
      total: 6,
      status: "Limite Próximo",
    },
  ];

  const dadosGrafico = equipe.map((membro) => ({
    label: membro.id.toString(),
    value: membro.carga,
  }));

  // useEffect(() => {
  //   const fetchPessoas = async () => {
  //     try {
  //       const entidadePai = idEntidadeWork;

  //       const response = await api.get("/api/v1/pessoa_fisica", {
  //         params: {
  //           entidade_pai: entidadePai,
  //           page: 0,
  //           size: 10,
  //         },
  //       });

  //       setPessoas(response.data?.elements || []);
  //     } catch (error) {
  //       console.error("Erro ao buscar pessoas", error);
  //     }
  //   };

  //   fetchPessoas();
  // }, [idEntidadeWork]);

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        const response = await api.get("/api/v1/equipe", {
          params: { page: 0, size: 100 },
        });

        setEquipes(response.data?.elements || []);
      } catch (error) {
        console.error("Erro ao buscar equipes", error);
      }
    };

    fetchEquipes();
  }, []);

  const fetchMembrosEquipe = async (id: number) => {
    try {
      const response = await api.get(`/api/v1/membro-equipe/equipe/${id}`, {
        params: { page: 0, size: 100 },
      });

      const data = response.data?.elements || [];

      setMembrosEquipe(
        data.map((item: any) => ({
          id: item.membro?.id,
          nome: item.membro?.nome,
        })),
      );
    } catch (error) {
      console.error("Erro ao buscar membros da equipe", error);
    }
  };

  const atribuirProcesso = async (proc: Tprocesso) => {
    if (!membroSelecionado) {
      showSnack("Selecione um responsável antes de atribuir.", "warning");
      return;
    }

    try {
      const payload = {
        processoJudicial: proc.id,
        status: 2,
        responsavel: Number(membroSelecionado),
        prioridade: 1,
        alocacao: new Date().toISOString(),
        inicio: null,
        termino: null,
        prazo: proc.prazo,
        observacao: "",
      };

      await api.post("/api/v1/calculo-judicial", payload);
      showSnack("Processo atribuído com sucesso!", "success");
      setProcessos((prev) => prev.filter((p) => p.id !== proc.id));
    } catch (error) {
      console.error("Erro ao atribuir processo", error);
      showSnack("Erro ao atribuir processo.", "error");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        p: 3,
      }}
    >
      <Grid container alignItems="center" mb={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Distribuição de Processos
          </Typography>
          <Typography color="text.secondary">
            Gerencie a alocação de processos e equilibre a demanda da equipe.
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
        >
          <Stack direction="row" spacing={2}>
            <Button variant="contained" sx={{ bgcolor: "#5c6cff" }}>
              Hoje, 24 Mai
            </Button>

            <IconButton>
              <CalendarTodayIcon />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Pendente"
            value={42}
            change="+5 hoje"
            icon={<ScheduleIcon sx={{ color: "#4F46E5" }} />}
            iconBg="#E0E7FF"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Distribuídos Hoje"
            value={18}
            change="Em andamento"
            icon={<CheckCircleIcon sx={{ color: "#16A34A" }} />}
            iconBg="#DCFCE7"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Capacidade Média"
            value="74%"
            change="Otimizada"
            icon={<CheckCircleIcon sx={{ color: "#2563EB" }} />}
            iconBg="#DBEAFE"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Prazo Crítico"
            value="08"
            change="Atenção"
            icon={<WarningAmberIcon sx={{ color: "#F59E0B" }} />}
            iconBg="#FEF3C7"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ flex: 1, minHeight: 0 }}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography fontWeight={600} mb={2} color="text.primary">
              Celula
            </Typography>

            {/* SEARCH */}
            <TextField
              fullWidth
              select
              size="small"
              label="Equipe"
              value={equipeSelecionada ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setEquipeSelecionada(id);
                fetchMembrosEquipe(id);
                setMembroSelecionado("");
              }}
              sx={{ mb: 3 }}
            >
              {equipes.map((eq) => (
                <MenuItem key={eq.id} value={eq.id}>
                  {eq.titulo}
                </MenuItem>
              ))}
            </TextField>
            <Typography fontWeight={600} mb={2} color="text.primary">
              Membros
            </Typography>
            <TextField
              fullWidth
              select
              size="small"
              label="Selecionar responsável"
              value={membroSelecionado}
              onChange={(e) => setMembroSelecionado(e.target.value)}
              sx={{ mb: 3 }}
              disabled={!equipeSelecionada} // 🔥 só ativa após escolher equipe
            >
              {membrosEquipe.map((membro) => (
                <MenuItem key={membro.id} value={membro.id}>
                  {membro.nome}
                </MenuItem>
              ))}
            </TextField>

            <Stack spacing={2}>
              {processos.map((proc: any) => (
                <Paper
                  key={proc.id}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #eee",
                  }}
                >
                  <Chip size="small" label={proc.tipoServico} sx={{ mb: 1 }} />

                  <Typography fontWeight={600} fontSize={14}>
                    {proc.processo}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {proc.cliente}
                  </Typography>

                  <Typography variant="caption">Fase: {proc.fase}</Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mt={2}
                    alignItems="center"
                  >
                    <Typography variant="caption" color="text.secondary">
                      Prazo: {proc.prazo || "N/A"}
                    </Typography>

                    <Button
                      size="small"
                      variant="contained"
                      sx={{ bgcolor: "#5c6cff" }}
                      onClick={() => atribuirProcesso(proc)}
                    >
                      Atribuir
                    </Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* COLUNA DIREITA - EQUIPE */}
        <Grid item xs={12} md={7} sx={{ display: "flex" }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            {/* HEADER */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ pb: 2 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                {/* <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: "#EEF2FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 18, color: "#4F46E5" }} />
                </Box> */}

                <Typography fontWeight={600}>Capacidade da Equipe</Typography>
              </Stack>

              <Stack direction="row" spacing={2}>
                {[
                  { label: "Live", color: "#22C55E" },
                  { label: "Normal", color: "#4F46E5" },
                  { label: "Sobrecarregado", color: "#F59E0B" },
                ].map((item) => (
                  <Stack
                    key={item.label}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: item.color,
                        borderRadius: "50%",
                      }}
                    />
                    <Typography variant="caption">{item.label}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            {/* CARDS */}
            <Grid container spacing={2} sx={{ flex: 1, overflow: "auto" }}>
              {equipe.map((membro) => {
                const porcentagem = (membro.carga / membro.total) * 100;

                const corBarra =
                  porcentagem >= 90
                    ? "#F59E0B"
                    : porcentagem >= 60
                      ? "#4F46E5"
                      : "#22C55E";

                return (
                  <Grid item xs={12} sm={6} key={membro.id}>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #eee",
                        height: "100%",
                      }}
                    >
                      {/* NOME + CARGA */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar />

                        <Box flex={1}>
                          <Typography fontWeight={600} fontSize={14}>
                            {membro.nome}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {membro.cargo}
                          </Typography>
                        </Box>

                        <Box textAlign="right">
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            CARGA
                          </Typography>
                          <Typography fontWeight={700} fontSize={14}>
                            {membro.carga}/{membro.total}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* PROGRESSO */}
                      <Box mt={2}>
                        <Typography variant="caption" color="text.secondary">
                          Processos ativos
                        </Typography>

                        <LinearProgress
                          variant="determinate"
                          value={porcentagem}
                          sx={{
                            mt: 0.5,
                            height: 6,
                            borderRadius: 5,
                            backgroundColor: "#F3F4F6",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: corBarra,
                            },
                          }}
                        />
                      </Box>

                      {/* STATUS */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        mt={2}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor:
                              membro.status === "Disponível"
                                ? "#22C55E"
                                : "#F59E0B",
                          }}
                        />

                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color={
                            membro.status === "Disponível"
                              ? "success.main"
                              : "warning.main"
                          }
                        >
                          {membro.status === "Disponível"
                            ? "DISPONÍVEL"
                            : "LIMITE PRÓXIMO"}
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
            <Box mt={3}>
              <GraficoDistribuicao
                data={dadosGrafico}
                title="Previsão de entrega por semana"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <SnackInfo
        open={snackOpen}
        message={snackMessage}
        type={snackType}
        onClose={() => setSnackOpen(false)}
      />
    </Box>
  );
}
