import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import "./index.css";
import App from "./App.tsx";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",

    fontWeightRegular: 400,
    fontWeightMedium: 500,

    button: {
      fontFamily: "Poppins, sans-serif",
      fontWeight: 500,
      textTransform: "none",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
