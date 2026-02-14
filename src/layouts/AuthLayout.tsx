// src/layouts/AuthLayout.tsx
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Outlet />
    </Box>
  );
}
