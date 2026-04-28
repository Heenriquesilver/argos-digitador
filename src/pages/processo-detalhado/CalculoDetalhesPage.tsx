import { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Tabs, Tab } from "@mui/material";
import { useLocation } from "react-router-dom";
import Info from "./components/tabs/info/info";
import ChatBot from "./components/tabs/chat-bot/chatBot";
import Documentos from "./components/tabs/documentos/documentos";
import Calculos from "./components/tabs/calculos/calculos";
import PjeCalc from "./components/tabs/pje-calc/pjeCalc";
import Auditoria from "./components/tabs/auditoria/auditoria";
import Parecer from "./components/tabs/parecer/parecer";
import Pedidos from "./components/tabs/pedidos/pedidos";
import Digitacao from "./components/tabs/digitacao/digitacao";
import SnackInfo from "../../components/snack-info/SnackInfo";
import api from "../../api/axios";

export default function CalculoDetalhesPage() {
  const { state } = useLocation();
  console.log("state", state);
  const [currentTab, setCurrentTab] = useState(0);
  const [processo, setProcesso] = useState<any>(null);

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    type: "success" as "success" | "error" | "warning" | "info",
  });

  const showSnack = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setSnack({
      open: true,
      message,
      type,
    });
  };

  // const { state } = useLocation() as { state: ProcessoRow };
  async function carregarProcesso() {
    try {
      const res = await api.get(`/api/v1/calculo-judicial/${state.id}`);
      setProcesso(res.data);
    } catch (error) {
      console.error("Erro ao carregar processo", error);
    }
  }

  useEffect(() => {
    carregarProcesso();
  }, []);

  async function atualizarStatus(novoStatus: number) {
    try {
      const agora = new Date().toISOString();

      const payload = {
        processoJudicial: processo.processoJudicial?.id,
        status: novoStatus,
        responsavel: processo.responsavel?.id ?? null,
        prioridade: String(processo.prioridade),
        alocacao: processo.alocacao,
        inicio: agora,
        termino: processo.termino,
        prazo: processo.prazo,
        observacao: processo.observacao || "",
      };

      await api.put(`/api/v1/calculo-judicial/${processo.id}`, payload);

      // 🔥 recarrega atualizado
      await carregarProcesso();

      localStorage.setItem("processosUpdated", "true");
      const mensagens: Record<number, string> = {
        3: "Processo iniciado com sucesso ",
        4: "Processo pausado ",
        8: "Processo finalizado com sucesso ",
      };

      showSnack(mensagens[novoStatus] || "Status atualizado", "success");
    } catch (error) {
      console.error("Erro ao atualizar status", error);

      showSnack("Erro ao atualizar status ❌", "error");
    }
  }

  function formatarData(data: string) {
    if (!data) return "";

    const d = new Date(data);

    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();

    return `${dia}-${mes}-${ano}`;
  }

  // async function handleIniciar() {
  //   try {
  //     const agora = new Date().toISOString();

  //     const res = await api.get(`/api/v1/calculo-judicial/${state.id}`);
  //     const c = res.data;

  //     const payload = {
  //       processoJudicial: c.processoJudicial?.id,
  //       status: 3,
  //       responsavel: c.responsavel?.id ?? null,
  //       prioridade: String(c.prioridade),
  //       alocacao: c.alocacao,
  //       inicio: agora,
  //       termino: c.termino,
  //       prazo: c.prazo,
  //       observacao: c.observacao || "",
  //     };

  //     await api.put(`/api/v1/calculo-judicial/${state.id}`, payload);
  //     localStorage.setItem("processosUpdated", "true");
  //     console.log("Processo iniciado com sucesso");
  //   } catch (error) {
  //     console.error("Erro ao iniciar processo", error);
  //   }
  // }
  // async function handleParar() {
  //   try {
  //     const agora = new Date().toISOString();

  //     const res = await api.get(`/api/v1/calculo-judicial/${state.id}`);
  //     const c = res.data;

  //     const payload = {
  //       processoJudicial: c.processoJudicial?.id,
  //       status: 4,
  //       responsavel: c.responsavel?.id ?? null,
  //       prioridade: String(c.prioridade),
  //       alocacao: c.alocacao,
  //       inicio: agora,
  //       termino: c.termino,
  //       prazo: c.prazo,
  //       observacao: c.observacao || "",
  //     };

  //     await api.put(`/api/v1/calculo-judicial/${state.id}`, payload);
  //     localStorage.setItem("processosUpdated", "true");
  //     console.log("Processo iniciado com sucesso");
  //   } catch (error) {
  //     console.error("Erro ao iniciar processo", error);
  //   }
  // }
  // async function handleFinalizar() {
  //   try {
  //     const agora = new Date().toISOString();

  //     const res = await api.get(`/api/v1/calculo-judicial/${state.id}`);
  //     const c = res.data;

  //     const payload = {
  //       processoJudicial: c.processoJudicial?.id,
  //       status: 8,
  //       responsavel: c.responsavel?.id ?? null,
  //       prioridade: String(c.prioridade),
  //       alocacao: c.alocacao,
  //       inicio: agora,
  //       termino: c.termino,
  //       prazo: c.prazo,
  //       observacao: c.observacao || "",
  //     };

  //     await api.put(`/api/v1/calculo-judicial/${state.id}`, payload);
  //     localStorage.setItem("processosUpdated", "true");
  //     console.log("Processo iniciado com sucesso");
  //   } catch (error) {
  //     console.error("Erro ao iniciar processo", error);
  //   }
  // }

  return (
    <Box p={3}>
      {/* CARD TOPO */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid #E5E7EB",
        }}
      >
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="flex-start"
          gap={2}
        >
          {/* ESQUERDA */}
          <Box flex="1 1 500px">
            <Typography variant="h6" fontWeight={600}>
              Processo {state?.processo}
            </Typography>

            <Box display="flex" gap={3} mt={1} flexWrap="wrap">
              <Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Cliente:</strong> {state.cliente}
                </Typography>

                {/* PRIORIDADE */}
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    bgcolor: "#FFF4E5",

                    fontWeight: 600,
                    display: "inline-block",
                  }}
                >
                  Prioridade: {state.prioridade}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* DIREITA */}
          <Box
            flex="1 1 260px"
            display="flex"
            flexDirection="column"
            alignItems={{ xs: "flex-start", md: "flex-end" }}
          >
            {/* DATA */}
            <Typography
              variant="caption"
              sx={{
                px: 1,
                py: 0.3,
                borderRadius: 1,
                bgcolor: "#FEE2E2",
                color: "#B91C1C",
                fontWeight: 600,
                mb: 0.5,
              }}
            >
              Prazo Fatal: {formatarData(state.prazo)}
            </Typography>

            {/* STATUS */}
            <Typography
              variant="caption"
              sx={{
                mb: 1.5,
                px: 1,
                py: 0.3,
                borderRadius: 1,
                bgcolor: `${processo?.status?.backcolor}`,

                fontWeight: 600,
              }}
            >
              Status: {processo?.status?.titulo}
            </Typography>

            {/* BOTÕES */}
            <Box display="flex" gap={1} flexWrap="wrap">
              <Button
                variant="contained"
                sx={{ bgcolor: "#5c6cff" }}
                onClick={() => atualizarStatus(3)}
              >
                Iniciar
              </Button>

              <Button
                variant="contained"
                sx={{ bgcolor: "#5c6cff" }}
                onClick={() => atualizarStatus(4)}
              >
                Parar
              </Button>

              <Button
                variant="contained"
                sx={{ bgcolor: "#5c6cff" }}
                onClick={() => atualizarStatus(8)}
              >
                Finalizar
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* ABAS */}
      <Tabs
        value={currentTab}
        onChange={(_, v) => setCurrentTab(v)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Info" />
        <Tab label="Documentos" />
        <Tab label="Pedidos" />
        <Tab label="Cálculos" />
        <Tab label="Chat Bot" />
        <Tab label="Pje-Calc" />
        <Tab label="Digitação" />
        <Tab label="Auditoria" />
        <Tab label="Parecer" />
      </Tabs>

      {/* CONTEÚDO DAS ABAS */}

      {/* INFO */}
      {currentTab === 0 && <Info />}

      {/* CHAT BOT */}
      {currentTab === 4 && <ChatBot />}

      {/* OUTRAS ABAS (placeholders) */}
      {currentTab === 1 && <Documentos />}
      {currentTab === 2 && <Pedidos />}
      {currentTab === 3 && <Calculos />}
      {currentTab === 5 && <PjeCalc />}
      {currentTab === 6 && <Digitacao />}
      {currentTab === 7 && <Auditoria />}
      {currentTab === 8 && <Parecer />}
      <SnackInfo
        open={snack.open}
        message={snack.message}
        type={snack.type}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
