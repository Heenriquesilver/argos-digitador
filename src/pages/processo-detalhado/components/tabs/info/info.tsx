import { Box, Typography, Button, Paper } from "@mui/material";

const Info = () => {
  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {/* COLUNA ESQUERDA */}
      <Box flex="1 1 600px">
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography fontWeight={600} mb={2}>
            Dados Processuais
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={2}>
            <Box flex="1 1 250px">
              <Typography variant="body2" color="text.secondary">
                Vara
              </Typography>
              <Typography>01ª Vara do Trabalho do Rio de Janeiro</Typography>

              <Typography variant="body2" color="text.secondary" mt={2}>
                Réu
              </Typography>
              <Typography>Empresa XPTO Ltda.</Typography>
            </Box>

            <Box flex="1 1 250px">
              <Typography variant="body2" color="text.secondary">
                Rito
              </Typography>
              <Typography>Ordinário</Typography>

              <Typography variant="body2" color="text.secondary" mt={2}>
                Autor
              </Typography>
              <Typography>João da Silva</Typography>
            </Box>

            <Box flex="1 1 100%">
              <Typography variant="body2" color="text.secondary">
                Observações Iniciais
              </Typography>
              <Typography>
                O reclamante alega horas extras não pagas referentes aos anos de
                2020 e 2021.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* COLUNA DIREITA */}
      <Box flex="1 1 320px" display="flex" flexDirection="column" gap={1}>
        {/* PROGRESSO */}
        {/* <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography fontWeight={600}>PROGRESSO</Typography>

          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="body2">Cálculo</Typography>
              <Typography variant="body2">45%</Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={45}
              sx={{ height: 8, borderRadius: 5 }}
            />
          </Box>
        </Paper> */}

        {/* AÇÕES RÁPIDAS */}
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography fontWeight={600} mb={2}>
            AÇÕES RÁPIDAS
          </Typography>

          <Button fullWidth variant="outlined" sx={{ mb: 1 }}>
            Anexar Documentos
          </Button>

          <Button fullWidth variant="outlined" sx={{ mb: 1 }}>
            Novo Cálculo
          </Button>

          <Button fullWidth variant="outlined">
            Contestar auditoria
          </Button>
        </Paper>

        {/* DOCS */}
        {/* <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontWeight={600}>DOCS RECENTES</Typography>

            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
            >
              Ver todos
            </Typography>
          </Box>

          <Typography variant="body2">Sentença_Procedente.pdf</Typography>
          <Typography variant="caption" color="text.secondary">
            Adicionado hoje
          </Typography>

          <Divider sx={{ my: 1 }} />

          <Typography variant="body2">Cartões_Ponto_2022.xlsx</Typography>
          <Typography variant="caption" color="text.secondary">
            Ontem
          </Typography>
        </Paper> */}
      </Box>
    </Box>
  );
};

export default Info;
