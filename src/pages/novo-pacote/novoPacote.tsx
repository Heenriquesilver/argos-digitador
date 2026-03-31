import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

export default function NovoPacotePage() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState("");
  const [prazo, setPrazo] = useState("");

  function salvarPacote() {
    if (!titulo || !valor || !prazo) {
      alert("Preencha todos os campos");
      return;
    }

    const payload = {
      titulo,
      valor,
      prazo,
    };

    console.log("Pacote criado:", payload);
    alert("Pacote criado com sucesso!");

    navigate(-1);
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={0.5} color="text.primary">
        Criar Pacote
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Preencha as informações abaixo para criar um pacote.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={600}>
            Dados do Pacote
          </Typography>

          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Valor / Cálculo"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Prazo"
                value={prazo}
                onChange={(e) => setPrazo(e.target.value)}
                required
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff" }}
              onClick={salvarPacote}
            >
              Salvar
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
