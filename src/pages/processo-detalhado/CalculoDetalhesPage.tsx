import { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Tabs, Tab } from "@mui/material";

import { Modal, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

import api from "../../api/axios";

import Info from "./components/tabs/info/Info";

import SnackInfo from "../../components/snack-info/SnackInfo";

// TABS
import Resultado from "./components/tabs/resultado/Resultado";
import Documentos from "./components/tabs/documentos/documentos";

export default function TarefaDetalhesPage() {
  const { state } = useLocation();

  const [currentTab, setCurrentTab] = useState(0);

  const [tarefa, setTarefa] = useState<any>(null);

  const [openPararModal, setOpenPararModal] = useState(false);

  const [openFinalizarModal, setOpenFinalizarModal] = useState(false);

  const [motivoParada, setMotivoParada] = useState("");

  const [resultadoFinal, setResultadoFinal] = useState("");

  const idUsuario = localStorage.getItem("idPessoaFisicaLogada");

  const navigate = useNavigate();

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

  async function carregarTarefa() {
    try {
      const res = await api.get(`/api/v1/tarefa-calculo-judicial/${state.id}`);

      setTarefa(res.data);
    } catch (error) {
      console.error("Erro ao carregar tarefa", error);

      showSnack("Erro ao carregar tarefa", "error");
    }
  }

  useEffect(() => {
    carregarTarefa();
  }, []);

  useEffect(() => {
    if (tarefa?.resultado) {
      setResultadoFinal(tarefa.resultado);
    }
  }, [tarefa]);

  const resultadoJaSalvo = Boolean(tarefa?.resultado?.trim());

  console.log("usuario tarefa", idUsuario);

  async function executarStatus(novoStatus: number) {
    try {
      const agora = new Date().toISOString();

      const payload = {
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,

        calculoJudicial: tarefa.calculoJudicial?.id,

        status: novoStatus,

        responsavel: idUsuario ?? null,

        prioridade: String(tarefa.prioridade),

        alocacao: tarefa.alocacao,

        inicio: agora,

        termino: tarefa.termino,

        prazo: tarefa.prazo,

        resultado: tarefa.resultado || "",

        observacao: tarefa.observacao || "",
      };

      await api.put(`/api/v1/tarefa-calculo-judicial/${tarefa.id}`, payload);

      await carregarTarefa();

      localStorage.setItem("tarefasUpdated", "true");

      const mensagens: Record<number, string> = {
        3: "Tarefa iniciada com sucesso",
        4: "Tarefa pausada",
        8: "Tarefa finalizada com sucesso",
      };

      showSnack(mensagens[novoStatus] || "Status atualizado", "success");
    } catch (error) {
      console.error("Erro ao atualizar status", error);

      showSnack("Erro ao atualizar status ❌", "error");
    }
  }

  async function atualizarStatus(novoStatus: number) {
    try {
      const agora = new Date().toISOString();

      const payload = {
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,

        calculoJudicial: tarefa.calculoJudicial?.id,

        status: novoStatus,

        responsavel: tarefa.responsavel?.id ?? null,

        prioridade: String(tarefa.prioridade),

        alocacao: tarefa.alocacao,

        inicio: agora,

        termino: tarefa.termino,

        prazo: tarefa.prazo,

        resultado: tarefa.resultado || "",

        observacao: tarefa.observacao || "",
      };

      await api.put(`/api/v1/tarefa-calculo-judicial/${tarefa.id}`, payload);

      await carregarTarefa();

      localStorage.setItem("tarefasUpdated", "true");

      const mensagens: Record<number, string> = {
        3: "Tarefa iniciada com sucesso",
        4: "Tarefa pausada",
        8: "Tarefa finalizada com sucesso",
      };

      showSnack(mensagens[novoStatus] || "Status atualizado", "success");
    } catch (error) {
      console.error("Erro ao atualizar status", error);

      showSnack("Erro ao atualizar status ❌", "error");
    }
  }

  async function finalizarTarefa() {
    try {
      const payload = {
        titulo: tarefa.titulo,

        descricao: tarefa.descricao,

        calculoJudicial: tarefa.calculoJudicial?.id,

        status: 8,

        responsavel: tarefa.responsavel?.id ?? null,

        prioridade: String(tarefa.prioridade),

        alocacao: tarefa.alocacao,

        inicio: tarefa.inicio,

        termino: new Date().toISOString(),

        prazo: tarefa.prazo,

        resultado: resultadoFinal,

        observacao: tarefa.observacao || "",
      };

      await api.put(`/api/v1/tarefa-calculo-judicial/${tarefa.id}`, payload);

      localStorage.setItem("tarefasUpdated", "true");

      showSnack("Tarefa finalizada com sucesso ✔️", "success");

      setTimeout(() => {
        navigate("/tarefa");
      }, 1000);
    } catch (error) {
      console.error(error);

      showSnack("Erro ao finalizar tarefa ❌", "error");
    }
  }

  async function confirmarParada() {
    try {
      const agora = new Date().toISOString();

      const observacaoFinal = `${
        tarefa.observacao || ""
      }\n[PARADA ${formatarData(agora)}]: ${motivoParada}`;

      const payload = {
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,

        calculoJudicial: tarefa.calculoJudicial?.id,

        status: 4,

        responsavel: tarefa.responsavel?.id ?? null,

        prioridade: String(tarefa.prioridade),

        alocacao: tarefa.alocacao,

        inicio: tarefa.inicio,

        termino: tarefa.termino,

        prazo: tarefa.prazo,

        resultado: tarefa.resultado || "",

        observacao: observacaoFinal,
      };

      await api.put(`/api/v1/tarefa-calculo-judicial/${tarefa.id}`, payload);

      await carregarTarefa();

      setOpenPararModal(false);

      setMotivoParada("");

      showSnack("Tarefa pausada com motivo ✔️", "success");
    } catch (error) {
      console.error(error);

      showSnack("Erro ao parar tarefa ❌", "error");
    }
  }

  async function confirmarFinalizacao() {
    try {
      await atualizarStatus(8);

      setOpenFinalizarModal(false);

      navigate("/tarefa");
    } catch (error) {
      console.error(error);
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

  return (
    <Box p={4}>
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
            <Box display={"flex"} gap={50}>
              <Typography variant="h6" fontWeight={600}>
                Tarefa: {tarefa?.id}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                Responsável: {tarefa?.responsavel?.nome}
              </Typography>
            </Box>

            <Box display="flex" gap={3} flexWrap="wrap">
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Processo:
                  {tarefa?.calculoJudicial?.processoJudicial?.numeroProcesso}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  <strong>Cliente:</strong>{" "}
                  {
                    tarefa?.calculoJudicial?.processoJudicial?.cliente
                      ?.nomeFantasia
                  }
                </Typography>

                {/* PRIORIDADE */}
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    px: 1,
                    py: 0.2,
                    borderRadius: 1,
                    bgcolor: "#FFF4E5",
                    fontWeight: 600,
                    display: "inline-block",
                  }}
                >
                  Prioridade: {tarefa?.prioridade}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* DIREITA */}
          <Box
            flex="1 1 260px"
            display="flex"
            flexDirection="column"
            alignItems={{
              xs: "flex-start",
              md: "flex-end",
            }}
          >
            {/* PRAZO */}
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
              Prazo: {formatarData(tarefa?.prazo)}
            </Typography>

            {/* STATUS */}
            <Typography
              variant="caption"
              sx={{
                mb: 1.5,
                px: 1,
                py: 0.3,
                borderRadius: 1,
                bgcolor: tarefa?.status?.backcolor,
                fontWeight: 600,
              }}
            >
              Status: {tarefa?.status?.titulo}
            </Typography>

            {/* BOTÕES */}
            <Box display="flex" gap={1} flexWrap="wrap">
              <Button
                variant="contained"
                sx={{ bgcolor: "#218a07ff" }}
                onClick={() => executarStatus(3)}
              >
                Iniciar
              </Button>

              <Button
                variant="contained"
                sx={{ bgcolor: "#dc2505ff" }}
                onClick={() => setOpenPararModal(true)}
              >
                Parar
              </Button>

              <Button
                variant="contained"
                sx={{ bgcolor: "#000000ff" }}
                onClick={() => setCurrentTab(1)}
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
        <Tab label="Resultado" />
      </Tabs>

      {/* CONTEÚDO */}
      {currentTab === 0 && (
        <Info
          titulo={tarefa?.titulo}
          descricao={tarefa?.descricao}
          observacao={tarefa?.observacao}
        />
      )}

      {currentTab === 1 && <Documentos />}

      {currentTab === 2 && (
        <Resultado
          tarefa={tarefa}
          resultadoFinal={resultadoFinal}
          setResultadoFinal={setResultadoFinal}
          finalizarTarefa={finalizarTarefa}
          resultadoJaSalvo={resultadoJaSalvo}
        />
      )}
      <Modal open={openPararModal} onClose={() => setOpenPararModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 3,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" mb={2} color="text.primary">
            Motivo da parada
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            value={motivoParada}
            onChange={(e) => setMotivoParada(e.target.value)}
            placeholder="Digite o motivo..."
          />

          <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
            <Button onClick={() => setOpenPararModal(false)}>Cancelar</Button>

            <Button
              variant="contained"
              color="error"
              onClick={confirmarParada}
              disabled={!motivoParada.trim()}
            >
              Confirmar parada
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openFinalizarModal}
        onClose={() => setOpenFinalizarModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 3,
            boxShadow: 24,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" color="text.primary">
              Confirmar finalização
            </Typography>
          </Box>

          <Typography mt={2} color="text.primary">
            Tem certeza que deseja finalizar esta tarefa?
          </Typography>

          <Box display="flex" justifyContent="flex-end" mt={3} gap={1}>
            <Button onClick={() => setOpenFinalizarModal(false)}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              sx={{ bgcolor: "#000" }}
              onClick={confirmarFinalizacao}
            >
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* SNACK */}
      <SnackInfo
        open={snack.open}
        message={snack.message}
        type={snack.type}
        onClose={() =>
          setSnack((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </Box>
  );
}
