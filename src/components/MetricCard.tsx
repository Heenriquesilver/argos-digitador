import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { green, red } from "@mui/material/colors";

export interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  iconBg: string;
}

export default function MetricCard({
  title,
  value,
  change,
  icon,
  iconBg,
}: MetricCardProps) {
  const isNegative = change.startsWith("-");

  return (
    <Card sx={{ p: 2, minHeight: 120, borderRadius: 3 }}>
      <CardContent sx={{ p: 0 }}>
        {/* Ícone e mudança */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="body2" color="text.secondary" mb={0.5}>
            {title}
          </Typography>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: iconBg,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>

        {/* Título */}

        <Typography variant="h5" fontWeight={600}>
          {value}
        </Typography>
        <Typography
          variant="body2"
          fontWeight={600}
          color={isNegative ? red[500] : green[500]}
        >
          {change}
        </Typography>

        {/* Valor */}
      </CardContent>
    </Card>
  );
}
