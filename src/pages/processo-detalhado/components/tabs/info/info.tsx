import { Box, Typography, Paper } from "@mui/material";

type TInfoProps = {
  titulo: string;
  descricao: string;
  observacao: string;
};

export default function Info({ titulo, descricao, observacao }: TInfoProps) {
  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {/* COLUNA PRINCIPAL */}
      <Box flex="1 1 700px">
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid #E5E7EB",
          }}
        >
          <Typography fontWeight={600} mb={3} fontSize={18}>
            Informações da Tarefa
          </Typography>

          <Box display="flex" flexDirection="column" gap={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Título da tarefa
              </Typography>

              <Typography fontWeight={500}>{titulo || "-"}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Descrição
              </Typography>

              <Typography whiteSpace="pre-wrap">{descricao || "-"}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Observações
              </Typography>

              <Typography whiteSpace="pre-wrap">{observacao || "-"}</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
