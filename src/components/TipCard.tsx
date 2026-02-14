import { Card, CardContent, Typography } from "@mui/material";

export default function TipCard() {
  return (
    <Card sx={{ backgroundColor: "#f5f3ff" }}>
      <CardContent>
        <Typography fontWeight={600} mb={1}>
          AI Tip
        </Typography>

        <Typography variant="body2" color="text.secondary">
          You can optimize SalesBot by reducing the context history to 5
          messages.
        </Typography>
      </CardContent>
    </Card>
  );
}
