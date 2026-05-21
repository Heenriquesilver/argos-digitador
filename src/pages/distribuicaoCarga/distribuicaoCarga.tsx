import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
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

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ptBR } from "date-fns/locale";

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

type TCargaEquipe = {
  membroEquipeId: number;
  metaDia: number;
  alocadoDia: number;
  metaMes: number;
  alocadoMes: number;
  membroEquipeNome: string;
};

export default function DistribuicaoCarga() {
  const [equipes, setEquipes] = useState<any[]>([]);
  const [equipeSelecionada, setEquipeSelecionada] = useState<number | null>(
    null,
  );
  const [membrosEquipe, setMembrosEquipe] = useState<any[]>([]);
  const [membroSelecionado, setMembroSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());

  const [cargaEquipe, setCargaEquipe] = useState<TCargaEquipe[]>([]);

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

  const dadosGrafico = cargaEquipe.map((membro) => ({
    label: membro.membroEquipeNome,
    value: membro.alocadoDia,
  }));

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

  const fetchCargaEquipe = async (
    equipeId: number,
    data: Date = dataSelecionada,
  ) => {
    try {
      const dia = data.getDate();
      const mes = data.getMonth() + 1;
      const ano = data.getFullYear();

      const response = await api.get("/api/v1/datainfo-equipe/carga-trabalho", {
        params: {
          equipe: equipeId,
          dia,
          mes,
          ano,
        },
      });

      setCargaEquipe(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar carga da equipe", error);
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

      if (equipeSelecionada) {
        await fetchCargaEquipe(equipeSelecionada, dataSelecionada);
      }

      showSnack("Processo atribuído com sucesso!", "success");

      setProcessos((prev) => prev.filter((p) => p.id !== proc.id));
    } catch (error) {
      console.error("Erro ao atribuir processo", error);
      showSnack("Erro ao atribuir processo.", "error");
    }
  };

  // const dataAtual = dataSelecionada
  //   .toLocaleDateString("pt-BR", {
  //     day: "2-digit",
  //     month: "short",
  //   })
  //   .replace(".", "");

  // const dataFormatada = dataAtual.charAt(0).toUpperCase() + dataAtual.slice(1);

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
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={ptBR}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="contained"
                startIcon={<CalendarTodayIcon />}
                sx={{
                  bgcolor: "#30B2E4",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2,
                }}
              >
                {dataSelecionada.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Button>

              <DatePicker
                value={dataSelecionada}
                onChange={(novaData: any) => {
                  if (!novaData) return;

                  setDataSelecionada(novaData);

                  if (equipeSelecionada) {
                    fetchCargaEquipe(equipeSelecionada, novaData);
                  }
                }}
                slots={{
                  openPickerIcon: CalendarTodayIcon,
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: {
                      width: 0,
                      opacity: 0,
                      position: "absolute",
                    },
                  },
                }}
              />
            </Stack>
          </LocalizationProvider>
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
                fetchCargaEquipe(id, dataSelecionada);

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
                      sx={{ bgcolor: "#30B2E4" }}
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
                  { label: "Disponível", color: "#F59E0B" },
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
              {cargaEquipe.map((membro) => {
                const porcentagemDia =
                  membro.metaDia > 0
                    ? (membro.alocadoDia / membro.metaDia) * 100
                    : 0;

                const porcentagemMes =
                  membro.metaMes > 0
                    ? (membro.alocadoMes / membro.metaMes) * 100
                    : 0;

                const corBarraDia =
                  porcentagemDia >= 90
                    ? "#F59E0B"
                    : porcentagemDia >= 60
                      ? "#4F46E5"
                      : "#F59E0B";

                const corBarraMes =
                  porcentagemMes >= 90
                    ? "#F59E0B"
                    : porcentagemMes >= 60
                      ? "#4F46E5"
                      : "#22C55E";

                return (
                  <Grid item xs={12} sm={6} key={membro.membroEquipeId}>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #eee",
                        height: "100%",
                      }}
                    >
                      {/* HEADER */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar />

                        <Box flex={1}>
                          <Typography fontWeight={600} fontSize={14}>
                            {membro.membroEquipeNome}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            Capacidade diária
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
                            {membro.alocadoDia}/{membro.metaDia}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* CALCULOS DO DIA */}
                      <Box mt={2}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          mb={0.5}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Cálculos do Dia
                          </Typography>

                          <Typography variant="caption" fontWeight={600}>
                            {membro.alocadoDia}/{membro.metaDia}
                          </Typography>
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={porcentagemDia}
                          sx={{
                            height: 6,
                            borderRadius: 5,
                            backgroundColor: "#F3F4F6",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: corBarraDia,
                            },
                          }}
                        />
                      </Box>

                      {/* CALCULOS DO MES */}
                      <Box mt={2}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          mb={0.5}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Cálculos do Mês
                          </Typography>

                          <Typography variant="caption" fontWeight={600}>
                            {membro.alocadoMes}/{membro.metaMes}
                          </Typography>
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={porcentagemMes}
                          sx={{
                            height: 6,
                            borderRadius: 5,
                            backgroundColor: "#F3F4F6",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: corBarraMes,
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
                              porcentagemDia >= 90 ? "#F59E0B" : "#22C55E",
                          }}
                        />

                        <Typography
                          variant="caption"
                          fontWeight={600}
                          color={
                            porcentagemDia >= 90
                              ? "warning.main"
                              : "success.main"
                          }
                        >
                          {porcentagemDia >= 90
                            ? "LIMITE PRÓXIMO"
                            : "DISPONÍVEL"}
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
