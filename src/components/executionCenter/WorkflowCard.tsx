import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Avatar,
  AvatarGroup,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

type WorkflowCardProps = {
  title: string;
  description: string;
  duration: string;
  complexity?: "baixa" | "media" | "alta";
};

export default function WorkflowCard({
  title,
  description,
  duration,
  complexity = "media",
}: WorkflowCardProps) {
  return (
    <Grid item xs={12} sm={6}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <Stack spacing={2} flex={1}>
            {/* TOPO */}
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={600}>{title}</Typography>

              <Chip label={`${duration}`} size="small" variant="outlined" />
            </Stack>

            {/* DESCRIÇÃO */}
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>

            {/* AGENTES */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <AvatarGroup max={4}>
                <Avatar />
                <Avatar />
                <Avatar />
                <Avatar />
              </AvatarGroup>

              {complexity === "alta" && (
                <Chip label="Alta complexidade" size="small" color="warning" />
              )}
            </Stack>
          </Stack>

          {/* AÇÃO */}
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            sx={{ mt: 2 }}
            fullWidth
          >
            Iniciar Execução
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
}
