import { Card, CardContent, Typography, Stack, Button } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import HubIcon from "@mui/icons-material/Hub";
import SettingsIcon from "@mui/icons-material/Settings";

export default function QuickActions() {
  return (
    <Card>
      <CardContent>
        <Typography fontWeight={600} mb={2}>
          Quick Actions
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            variant="text"
            sx={{
              padding: 4,
              color: "#5c6cff",
              backgroundColor: "#f5f6f8",
              display: "flex",
              gap: "3px",
              flexDirection: "column",
              "&:hover": {
                backgroundColor: "#e5e7eb",
                borderColor: "#000",
              },
            }}
          >
            <BarChartIcon sx={{ color: "#5c6cff" }} />
            View Reports
          </Button>

          <Button
            fullWidth
            variant="text"
            sx={{
              padding: 4,
              color: "#5c6cff",
              backgroundColor: "#f5f6f8",
              display: "flex",
              gap: "3px",
              flexDirection: "column",
              "&:hover": {
                backgroundColor: "#e5e7eb",
                borderColor: "#000",
              },
            }}
          >
            <HubIcon />
            New Integration
          </Button>

          <Button
            fullWidth
            variant="text"
            sx={{
              padding: 4,
              color: "#5c6cff",
              backgroundColor: "#f5f6f8",
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              "&:hover": {
                backgroundColor: "#e5e7eb",
                borderColor: "#000",
              },
            }}
          >
            <SettingsIcon />
            Settings
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
