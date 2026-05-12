import { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useAuth } from "../../auth/useAuth";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AlterarSenhaPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSalvar = async () => {
    if (!senha) {
      alert("Informe a nova senha");
      return;
    }

    try {
      setLoading(true);

      await api.put(`/api/v1/usuario/${user.id}`, {
        email: user.email,
        senha: senha,
        ativo: 1,
      });

      alert("Senha alterada com sucesso!");
      navigate("/perfil");
    } catch (err) {
      console.error(err);
      alert("Erro ao alterar senha");
    } finally {
      setLoading(false);
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
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Alterar Senha
        </Typography>

        <TextField
          label="E-mail"
          fullWidth
          margin="normal"
          value={user?.email || ""}
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="Nova senha"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box mt={2} display="flex" gap={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/perfil")}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSalvar}
            disabled={loading}
            sx={{ bgcolor: "#5c6cff" }}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
