import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import SnackInfo from "../../components/snack-info/SnackInfo";

export default function EditarMembroEquipePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [metaDiaria, setMetaDiaria] = useState(0);
  const [metaMensal, setMetaMensal] = useState(0);
  const [maturidadeSelecionada, setMaturidadeSelecionada] = useState<
    number | ""
  >("");
  const [maturidades, setMaturidades] = useState<any[]>([]);
  const [risco, setRisco] = useState(0);
  const [execucao, setExecucao] = useState(0);

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

  // 🔥 Buscar dados do membro
  async function buscarMembro() {
    try {
      const res = await api.get(`/api/v1/membro-equipe/${id}`);
      const m = res.data;

      setNome(m.membro?.nome || "");
      setMetaDiaria(m.metaDiaria || 0);
      setMetaMensal(m.metaMensal || 0);
      setMaturidadeSelecionada(m.maturidade?.id || "");
      setRisco(m.risco || 0);
      setExecucao(m.execucao || 0);
    } catch (error) {
      console.error("Erro ao buscar membro", error);
      showSnack("Erro ao carregar dados", "error");
    }
  }

  // 🔥 Buscar maturidades
  async function carregarMaturidades() {
    try {
      const res = await api.get("/api/v1/equipe-maturidade", {
        params: { page: 0, size: 100 },
      });

      setMaturidades(res.data.elements);
    } catch (error) {
      console.error("Erro ao carregar maturidades", error);
    }
  }

  useEffect(() => {
    if (id) {
      buscarMembro();
      carregarMaturidades();
    }
  }, [id]);

  // 🔥 Salvar edição
  async function salvar() {
    try {
      const payload = {
        metaDiaria,
        metaMensal,
        maturidade: Number(maturidadeSelecionada),
        risco,
        execucao,
      };

      await api.put(`/api/v1/membro-equipe/${id}`, payload);

      showSnack("Membro atualizado com sucesso!", "success");

      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar", error);
      showSnack("Erro ao atualizar membro", "error");
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={0.5} color="text.primary">
        Editar Membro
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Atualize as informações do membro da equipe.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* NOME (READ ONLY) */}
          <TextField label="Nome" value={nome} fullWidth disabled />

          {/* MATURIDADE */}
          <TextField
            select
            label="Senioridade"
            value={maturidadeSelecionada}
            onChange={(e) => setMaturidadeSelecionada(Number(e.target.value))}
            fullWidth
          >
            {maturidades.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.titulo}
              </MenuItem>
            ))}
          </TextField>

          {/* METAS */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Meta Diária"
              type="number"
              value={metaDiaria}
              onChange={(e) => setMetaDiaria(Number(e.target.value))}
              fullWidth
            />

            <TextField
              label="Meta Mensal"
              type="number"
              value={metaMensal}
              onChange={(e) => setMetaMensal(Number(e.target.value))}
              fullWidth
            />
          </Stack>

          {/* CHECKS */}
          <Stack direction="row" spacing={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={risco === 1}
                  onChange={(e) => setRisco(e.target.checked ? 1 : 0)}
                />
              }
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
            />
          </Stack>

          {/* BOTÕES */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff" }}
              onClick={salvar}
              disabled={!maturidadeSelecionada}
            >
              Salvar
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <SnackInfo
        open={snackOpen}
        message={snackMessage}
        type={snackType}
        onClose={() => setSnackOpen(false)}
      />
    </Box>
  );
}
