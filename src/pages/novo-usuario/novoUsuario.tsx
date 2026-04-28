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
import SnackInfo from "../../components/snack-info/SnackInfo";

import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

export default function NovoUsuarioPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [ativo, setAtivo] = useState(1);
  const [chaveAtivacao, setChaveAtivacao] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("");

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
          setNomeUsuario(data.pessoaFisica.nome);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário", error);
      } finally {
        setLoading(false);
      }
    }

    carregarUsuario();
  }, [id]);

  // async function salvarUsuario() {
  //   try {
  //     if (!id) {
  //       showSnack(
  //         "Usuario precisa estar cadastrado a um colaborador",
  //         "warning",
  //       );
  //       return;
  //     }

  //     if (!email || !senha || !confirmarSenha) {
  //       showSnack("Preencha todos os campos.", "warning");
  //       return;
  //     }

  //     if (senha !== confirmarSenha) {
  //       showSnack("As senhas não coincidem.", "warning");
  //       return;
  //     }

  //     const payload = {
  //       pessoaFisica: Number(id),
  //       email,
  //       senha,
  //       ativo,
  //       chaveAtivacao: "",
  //     };

  //     if (usuarioId) {
  //       await api.put(`/api/v1/usuario/${usuarioId}`, payload);
  //       showSnack("Usuário atualizado com sucesso!", "success");
  //     } else {
  //       await api.post("/api/v1/usuario", payload);
  //       showSnack("Usuario cadastrado com sucesso!", "success");
  //     }

  //     navigate(-1);
  //   } catch (error) {
  //     console.error("Erro ao salvar usuário", error);
  //     showSnack("Erro ao salvar usuário", "error");
  //   }
  // }

  async function salvarUsuario() {
    try {
      setLoading(true);

      if (!email || !senha || !confirmarSenha) {
        showSnack("Preencha todos os campos.", "warning");
        return;
      }

      if (senha !== confirmarSenha) {
        showSnack("As senhas não coincidem.", "warning");
        return;
      }

      const payload = {
        pessoaFisica: Number(id),
        email,
        senha,
        ativo,
        chaveAtivacao: "",
      };
      console.log("Antes do post de usuario", new Date());
      if (usuarioId) {
        await api.put(`/api/v1/usuario/${usuarioId}`, payload);
        showSnack("Usuário atualizado com sucesso!", "success");
      } else {
        await api.post("/api/v1/usuario", payload);
        showSnack("Usuario cadastrado com sucesso!", "success");
      }
      console.log("Depois do post de usuario", new Date());
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar usuário", error);
      showSnack("Erro ao salvar usuário", "error");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={0.5} color="text.primary">
        {usuarioId ? `Editar Usuário ${nomeUsuario}` : "Cadastro de Usuário"}
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
      <SnackInfo
        open={snackOpen}
        message={snackMessage}
        type={snackType}
        onClose={() => setSnackOpen(false)}
      />
    </Box>
  );
}
