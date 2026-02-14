import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";

type Props = {
  title: string;
  description: string;
  status: "pronto" | "em_uso";
  actionLabel: string;
};

export default function AgentCard({
  title,
  description,
  status,
  actionLabel,
}: Props) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Chip
              label={status === "pronto" ? "PRONTO" : "EM USO"}
              color={status === "pronto" ? "success" : "warning"}
              size="small"
              sx={{ width: "fit-content" }}
            />

            <Typography fontWeight={600}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>

            <Button variant="contained" fullWidth>
              {actionLabel}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}
