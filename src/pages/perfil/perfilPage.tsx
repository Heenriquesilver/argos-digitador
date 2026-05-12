import { Box, TextField, Typography, Paper } from "@mui/material";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

export default function PerfilPage() {
  const { user } = useAuth();

  const pessoa = user?.pessoaFisica || {};
  const entidade = pessoa?.entidade || {};
  const navigate = useNavigate();

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
          Dados do Usuário
        </Typography>
        <Box sx={{ display: "flex", gap: "5px" }}>
          <TextField
            label="Nome Social"
            fullWidth
            margin="normal"
            value={entidade?.nomeSocial || ""}
            disabled
          />

          <TextField
            label="Nome"
            fullWidth
            margin="normal"
            value={pessoa?.nome || ""}
            disabled
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={user?.email || ""}
            disabled
          />
        </Box>
        <Box sx={{ display: "flex", gap: "5px" }}>
          <TextField
            label="Telefone"
            fullWidth
            margin="normal"
            value={pessoa?.telefone || ""}
            disabled
          />

          <TextField
            label="CPF"
            fullWidth
            margin="normal"
            value={pessoa?.cpf || ""}
            disabled
          />

          <TextField
            label="Data de nascimento"
            fullWidth
            margin="normal"
            value={pessoa?.dtNascto || ""}
            disabled
          />
        </Box>
        <Box mt={2} textAlign="right">
          <Button
            variant="contained"
            onClick={() => navigate("/alterar-senha")}
            sx={{
              bgcolor: "#5c6cff",
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Modificar senha
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
