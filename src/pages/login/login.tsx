import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

import {
  Box,
  Button,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from "@mui/material";

import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

export default function LoginPage() {
  const { loginPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [credential, setCredential] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await loginPassword(email, credential);
      navigate("/home");
    } catch (err) {
      console.error("ERRO LOGIN:", err);
      setError("Falha no login. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 🌌 BACKGROUND ESQUERDO */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage: "url('/images/bg-lexcalc.jpg')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* 📦 PAINEL DO FORMULÁRIO (DIREITA) */}
      <Box
        sx={{
          width: { xs: "100%", md: 420 },
          height: "100vh",
          bgcolor: "#f8fbff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "-8px 0 30px rgba(0,0,0,0.08)",
        }}
      >
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 340,
            textAlign: "center",
            p: 3,
            borderRadius: 4,
            bgcolor: "transparent",
          }}
        >
          {/* ESPAÇO PARA O LOGO */}
          <Box sx={{ height: 80 }} />

          <Box
            component="img"
            src="/images/bg-form-lexcalc.png"
            alt="Logo LexCalc"
            sx={{
              width: 190,
              height: "auto",
              display: "block",
              margin: "0 auto",
              transform: "scale(2.0)",
              transformOrigin: "center",
              mb: 13,
            }}
          />
          <ToggleButtonGroup
            value="signin"
            exclusive
            fullWidth
            sx={{
              bgcolor: "#eef2ff",
              borderRadius: 5,
              "& .MuiToggleButton-root": { border: "none", borderRadius: 5 },
              "& .Mui-selected": {
                bgcolor: "#5c6cff !important",
                color: "#fff !important",
                boxShadow: "0 2px 8px rgba(92,108,255,0.35)",
                "&:hover": {
                  bgcolor: "#5c6cff",
                },
              },
            }}
          >
            <ToggleButton value="signin">Conectar</ToggleButton>
            <ToggleButton value="signup">Cadastrar</ToggleButton>
          </ToggleButtonGroup>
          {/* EMAIL */}
          <Box mt={3}>
            <Typography textAlign="left" fontSize={14} mb={1}>
              E-mail
            </Typography>
            <TextField
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ bgcolor: "#fff", borderRadius: 3 }}
            />
          </Box>

          <Box mt={2}>
            <Typography textAlign="left" fontSize={14} mb={1}>
              Senha
            </Typography>
            <TextField
              type={showPassword ? "text" : "password"}
              fullWidth
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              sx={{ bgcolor: "#fff", borderRadius: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box mt={1} textAlign="right">
            <Typography fontSize={13} color="#5c6cff">
              Esqueceu a senha ?
            </Typography>
          </Box>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#5c6cff",
              py: 1.5,
              borderRadius: 5,
              textTransform: "none",
              fontSize: 16,
            }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "loading..." : "Entrar"}
          </Button>
          <Typography mt={1.5} fontSize={12} color="gray" textAlign="center">
            Versão 3.2026.04.27
          </Typography>
          {error && (
            <Typography color="error" mt={2} fontSize={14}>
              {error}
            </Typography>
          )}
          {/* <Typography fontSize={12} mt={3} color="gray">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Typography> */}
        </Paper>
      </Box>
    </Box>
  );
}
