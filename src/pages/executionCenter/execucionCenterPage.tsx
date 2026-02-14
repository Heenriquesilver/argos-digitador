import { Box, Typography, TextField, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/GridLegacy";
import AgentCard from "../../components/executionCenter/AgentCard";
import WorkflowCard from "../../components/executionCenter//WorkflowCard";
import WorkflowFilters from "../../components/executionCenter/WorkFlowFilters";

export default function ExecutionCenterPage() {
  return (
    <Box
      sx={{
        flex: 1,
        p: 3,
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER */}
      <Grid container alignItems="center" spacing={2} mb={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Meus Agentes
          </Typography>
          <Typography color="text.secondary">
            Selecione um especialista para iniciar uma tarefa individual
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar agentes..."
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* AGENTES */}
      <Grid container spacing={2} mb={5}>
        <AgentCard
          title="Agente de Vendas"
          description="Especialista em negociação e prospecção"
          status="pronto"
          actionLabel="Iniciar Chat"
        />
        <AgentCard
          title="Suporte Técnico"
          description="Resolução de problemas técnicos e integrações"
          status="em_uso"
          actionLabel="Retomar Sessão"
        />
        <AgentCard
          title="Analista de Dados"
          description="Processamento de dados complexos e insights"
          status="pronto"
          actionLabel="Executar"
        />
        <AgentCard
          title="Criador de Conteúdo"
          description="Criação de posts, blogs e scripts"
          status="pronto"
          actionLabel="Iniciar Chat"
        />
      </Grid>

      {/* WORKFLOWS */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Workflows Agênticos
          </Typography>
          <Typography color="text.secondary">
            Processos automatizados com múltiplos agentes colaborando
          </Typography>
        </Box>

        <WorkflowFilters />
      </Stack>

      <Grid container spacing={2}>
        <WorkflowCard
          title="Funil de Conteúdo B2B"
          description="Criação de posts, LinkedIn e Twitter automaticamente"
          duration="5 min"
        />
        <WorkflowCard
          title="Auditoria de Compliance"
          description="Verificação de contratos e relatórios de riscos"
          duration="15 min"
        />
        <WorkflowCard
          title="ETL e Dashboard Realtime"
          description="Extração, limpeza e visualização de dados"
          duration="8 min"
        />
        <WorkflowCard
          title="Triagem Inteligente de Tickets"
          description="Classificação e resposta automática"
          duration="10 min"
        />
      </Grid>
    </Box>
  );
}
