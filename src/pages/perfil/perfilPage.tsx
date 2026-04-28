import { Box, TextField, Typography, Paper } from "@mui/material";

export default function PerfilPage() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const pessoa = usuario?.pessoaFisica || {};
  const entidade = pessoa?.entidade || {};

  return (
    <Box sx={{ maxWidth: 600 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Dados do Usuário
        </Typography>

        <TextField
          label="Nome"
          fullWidth
          margin="normal"
          value={entidade?.nomeSocial || ""}
          disabled
        />

        <TextField
          label="Nome completo"
          fullWidth
          margin="normal"
          value={usuario?.nome || ""}
          disabled
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={usuario?.email || ""}
          disabled
        />

        <TextField
          label="Telefone"
          fullWidth
          margin="normal"
          value={usuario?.telefone || ""}
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
      </Paper>
    </Box>
  );
}
