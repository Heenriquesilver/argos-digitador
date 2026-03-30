import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function NovoUsuarioPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [ativo, setAtivo] = useState(1);
  const [chaveAtivacao, setChaveAtivacao] = useState("");

  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregarUsuario() {
      if (!id) return;

      try {
        setLoading(true);

        const response = await api.get(`/api/v1/usuario/pessoa-fisica/${id}`);

        const data = response.data;

        if (data && data.id) {
          setUsuarioId(data.id);
          setEmail(data.email || "");
          setChaveAtivacao(data.chaveAtivacao || "");
          setAtivo(data.ativo ?? 1);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário", error);
      } finally {
        setLoading(false);
      }
    }

    carregarUsuario();
  }, [id]);

  async function salvarUsuario() {
    try {
      if (!id) {
        alert("Erro: usuário precisa estar vinculado a um colaborador");
        return;
      }

      if (!email || !senha || !confirmarSenha) {
        alert("Preencha todos os campos");
        return;
      }

      if (senha !== confirmarSenha) {
        alert("As senhas não coincidem");
        return;
      }

      const payload = {
        pessoaFisica: Number(id),
        email,
        senha,
        ativo,
        chaveAtivacao: "",
      };

      if (usuarioId) {
        await api.put(`/api/v1/usuario/${usuarioId}`, payload);
        alert("Usuário atualizado com sucesso!");
      } else {
        await api.post("/api/v1/usuario", payload);
        alert("Usuário cadastrado com sucesso!");
      }

      navigate(-1);
    } catch (error) {
      console.error("Erro ao salvar usuário", error);
      alert("Erro ao salvar usuário");
    }
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={0.5} color="text.primary">
        {usuarioId ? "Editar Usuário" : "Cadastro de Usuário"}
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Preencha as informações abaixo para {usuarioId ? "editar" : "criar"} um
        usuário.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={600}>
            Dados de Acesso
          </Typography>

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Stack>
              <Stack direction={"row"} gap={2}>
                <TextField
                  fullWidth
                  label="Senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />

                <TextField
                  fullWidth
                  label="Confirmar Senha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
              </Stack>
            </Stack>

            <FormControlLabel
              control={
                <Checkbox
                  checked={ativo === 1}
                  onChange={(e) => setAtivo(e.target.checked ? 1 : 0)}
                />
              }
              label="Usuário Ativo"
            />
            {usuarioId && (
              <>
                <TextField
                  fullWidth
                  label="Chave de Ativação"
                  value={chaveAtivacao}
                  InputProps={{ readOnly: true }}
                />
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff" }}
              onClick={salvarUsuario}
              disabled={loading}
            >
              {usuarioId ? "Atualizar" : "Salvar"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
