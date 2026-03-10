import { useState } from "react";
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
import { useNavigate } from "react-router-dom";

export default function NovoProcessoPage() {
  const navigate = useNavigate();

  const [prioridade, setPrioridade] = useState<"NORMAL" | "ALTA" | "URGENTE">(
    "NORMAL",
  );

  return (
    <Box p={3}>
      {/* TÍTULO */}
      <Typography variant="h5" fontWeight={600} mb={0.5} color="text.primary">
        Cadastro de Processo
      </Typography>

      <Typography color="text.secondary" mb={3}>
        Preencha as informações abaixo para iniciar a gestão de um novo
        processo.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6" fontWeight={600}>
            Dados do Processo
          </Typography>

          {/* NOVA LINHA 1 */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            {/* CLIENTE + BUSCAR */}
            <Stack direction="row" spacing={1} flex={2}>
              <TextField
                fullWidth
                label="Cliente"
                placeholder="Nome completo do cliente ou empresa"
                required
              />

              <Button
                variant="contained"
                sx={{
                  bgcolor: "#5c6cff",
                  minWidth: 110,
                }}
              >
                Buscar
              </Button>
            </Stack>

            {/* FASE DO PROCESSO */}
            <TextField
              select
              label="Fase do Processo"
              required
              sx={{ flex: 1 }}
            >
              <MenuItem value="A">Opção A</MenuItem>
              <MenuItem value="B">Opção B</MenuItem>
              <MenuItem value="C">Opção C</MenuItem>
            </TextField>
          </Stack>

          {/* NOVA LINHA 2 */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Número do Processo"
              placeholder="0000000-00.0000.0.00.0000"
              required
            />

            <TextField fullWidth select label="Tipo de Serviço" required>
              <MenuItem value="TRABALHISTA">Trabalhista</MenuItem>
              <MenuItem value="CIVEL">Cível</MenuItem>
              <MenuItem value="PREVIDENCIARIO">Previdenciário</MenuItem>
            </TextField>

            <TextField fullWidth select label="Tribunal" required>
              <MenuItem value="A">Opção A</MenuItem>
              <MenuItem value="B">Opção B</MenuItem>
              <MenuItem value="C">Opção C</MenuItem>
            </TextField>
          </Stack>

          {/* LINHA 3 */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="center"
          >
            {/* PRAZO FATAL */}
            <TextField
              label="Prazo Fatal"
              type="date"
              InputLabelProps={{ shrink: true }}
              required
              sx={{ width: 230 }}
            />

            {/* PRIORIDADE */}
            <Box>
              <Typography fontSize={14} mb={1}>
                Prioridade
              </Typography>

              <Stack direction="row" spacing={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={prioridade === "NORMAL"}
                      onChange={() => setPrioridade("NORMAL")}
                      sx={{ borderRadius: "50%" }}
                    />
                  }
                  label="Normal"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={prioridade === "ALTA"}
                      onChange={() => setPrioridade("ALTA")}
                      sx={{ borderRadius: "50%" }}
                    />
                  }
                  label="Alta"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={prioridade === "URGENTE"}
                      onChange={() => setPrioridade("URGENTE")}
                      sx={{ borderRadius: "50%" }}
                    />
                  }
                  label="Urgente"
                />
              </Stack>
            </Box>
          </Stack>

          {/* OBSERVAÇÕES */}
          <TextField
            fullWidth
            label="Observações Adicionais"
            placeholder="Insira detalhes específicos sobre o cálculo ou instruções..."
            multiline
            rows={4}
          />

          {/* BOTÕES */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              sx={{ bgcolor: "#5c6cff" }}
              onClick={() => {
                alert("Processo salvo (mock) 😄");
              }}
            >
              Salvar Processo
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
