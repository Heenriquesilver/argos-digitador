import { Box, Typography, Button, Paper, TextField } from "@mui/material";

interface Props {
  tarefa: any;

  resultadoFinal: string;

  setResultadoFinal: (value: string) => void;

  finalizarTarefa: () => void;

  resultadoJaSalvo: boolean;
}

const Resultado = ({
  // tarefa,
  resultadoFinal,
  setResultadoFinal,
  finalizarTarefa,
}: Props) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {/* ESQUERDA */}
      <Box flex="1 1 700px">
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={3}>
            Resultado
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={1}>
            Descreva detalhadamente o resultado da execução da tarefa,
            observações finais, cálculos realizados, pendências ou qualquer
            informação relevante.
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={16}
            value={resultadoFinal}
            onChange={(e) => setResultadoFinal(e.target.value)}
            placeholder="Digite aqui o resultado final da tarefa..."
            sx={{
              mt: 2,
            }}
          />

          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                sx={{
                  px: 4,
                  bgcolor: "#30B2E4",
                  py: 1.2,
                }}
                disabled={!resultadoFinal.trim()}
                onClick={finalizarTarefa}
              >
                Salvar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Resultado;
