import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NovoProcessoPage() {
  const navigate = useNavigate();

  const [prioridade, setPrioridade] = useState<"NORMAL" | "URGENTE">("NORMAL");

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
          <Typography
            variant="h6"
            fontWeight={600}
            mb={0.5}
            color="text.primary"
          >
            Dados do Processo
          </Typography>
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
            <TextField fullWidth select label="Orgão Julgador" required>
              <MenuItem value="TRABALHISTA">Opção A</MenuItem>
              <MenuItem value="CIVEL">Opção B</MenuItem>
              <MenuItem value="PREVIDENCIARIO">Opção C</MenuItem>
            </TextField>
          </Stack>

          {/* LINHA 2 */}
          <TextField
            fullWidth
            label="Cliente / Parte"
            placeholder="Nome completo do cliente ou empresa"
            required
          />

          {/* LINHA 3 */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Prazo Fatal"
              type="date"
              InputLabelProps={{ shrink: true }}
              required
            />

            <Box>
              <Typography fontSize={14} mb={0.5}>
                Prioridade
              </Typography>
              <ToggleButtonGroup
                value={prioridade}
                exclusive
                onChange={(_, value) => value && setPrioridade(value)}
                sx={{ height: 56 }}
              >
                <ToggleButton
                  value="NORMAL"
                  sx={{
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Normal
                </ToggleButton>

                <ToggleButton
                  value="URGENTE"
                  sx={{
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                  }}
                >
                  Urgente
                </ToggleButton>
              </ToggleButtonGroup>
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

          {/* AÇÕES */}
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
