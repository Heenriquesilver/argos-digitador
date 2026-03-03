import { Box, Typography, Button, Stack } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import AddIcon from "@mui/icons-material/Add";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import MetricCard from "../../components/MetricCard";
import UsageChart from "../../components/UseChart";
import RecentActivities from "../../components/RecentActivities";
import QuickActions from "../../components/QuickActions";
import TipCard from "../../components/TipCard";
import { useAuth } from "../../auth/useAuth";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        flex: 1,
        p: 3,
        marginLeft: 2,
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <Grid container alignItems="center" mb={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Welcome Back, {user?.pessoaFisica.nome || user?.email}
          </Typography>
          <Typography color="text.secondary">
            Here is a summary of the performance of your intelligent agents.
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          display="flex"
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
          mt={{ xs: 2, md: 0 }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ bgcolor: "#5c6cff", py: 1.3 }}
            >
              Create New Agent
            </Button>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              sx={{
                color: "text.primary",
                bgcolor: "white",
              }}
            >
              Start Workflow
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* MÉTRICAS */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Agents"
            value={24}
            change="+12%"
            icon={<CheckCircleIcon sx={{ color: "#4F46E5" }} />}
            iconBg="#E0E7FF"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Workflows"
            value={12}
            change="+5%"
            icon={<AutoAwesomeIcon sx={{ color: "#7C3AED" }} />}
            iconBg="#F3E8FF"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Token Consumption"
            value="850k"
            change="0%"
            icon={<MonetizationOnIcon sx={{ color: "#FBBF24" }} />}
            iconBg="#FEF3C7"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Estimated Costs"
            value="$142.50"
            change="-18%"
            icon={<AttachMoneyIcon sx={{ color: "#16A34A" }} />}
            iconBg="#DCFCE7"
          />
        </Grid>
      </Grid>

      {/* GRÁFICO + ATIVIDADES */}
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={8}>
          <UsageChart />
        </Grid>

        <Grid item xs={12} md={4}>
          <RecentActivities />
        </Grid>
      </Grid>

      {/* ATALHOS + DICA */}
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={8}>
          <QuickActions />
        </Grid>

        <Grid item xs={12} md={4}>
          <TipCard />
        </Grid>
      </Grid>
    </Box>
  );
}
