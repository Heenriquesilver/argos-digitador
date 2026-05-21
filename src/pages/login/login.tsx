import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";

import InputAdornment from "@mui/material/InputAdornment";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
      navigate("/calculos");
    } catch (err) {
      console.error(err);
      setError("Dados inválidos para conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        bgcolor: "#0B1020",
      }}
    >
      {/* BARRA SUPERIOR (Ajustada para ocupar apenas o lado correto e não quebrar o layout) */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 58,
          background: "#111",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: 4,
          boxSizing: "border-box",
        }}
      >
        <Typography
          sx={{
            color: "#74BBF3",
            fontSize: { xs: 16, sm: 20 },
            fontWeight: 500,
            letterSpacing: 1,
          }}
        >
          BERNHOEFT CÁLCULOS JUDICIAIS
        </Typography>
      </Box>

      {/* LADO ESQUERDO (BANNER) */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          color: "#fff",
          width: "200%",
          backgroundImage: `url('/images/bg-argos.jpeg')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "100% 100%",

          bgcolor: "#0B1020",
        }}
      ></Box>

      {/* SEÇÃO DO FORMULÁRIO (Fixado a largura e centralizado) */}
      <Box
        sx={{
          width: { xs: "100%", md: 470 },
          minWidth: { md: 470 }, // Garante que o container não encolha de lado no notebook
          bgcolor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 3, sm: 6 },
          pt: 7, // Compensa a altura da barra preta do topo
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          sx={{
            width: "100%",
            maxWidth: 360,
            maxHeight: "calc(100vh - 90px)", // Evita estouro vertical em notebooks menores
            overflowY: "auto",
            overflowX: "hidden", // Evita qualquer quebra de largura para a direita
            pr: 0.5,
            "&::-webkit-scrollbar": { width: "5px" },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#E5E7EB",
              borderRadius: "10px",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 24, sm: 30 },
              fontWeight: 800,
              color: "#111827",
              mb: 0.5,
            }}
          >
            Bem-vindo, Líder
          </Typography>
          <Typography
            sx={{
              color: "#6B7280",
              mb: { xs: 3, lg: 4 },
              fontSize: { xs: 15, sm: 17 },
            }}
          >
            Insira suas credenciais para entrar.
          </Typography>
          {/* EMAIL */}
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              color: "#9CA3AF",
              mb: 1,
            }}
          >
            ENDEREÇO DE E-MAIL
          </Typography>
          <TextField
            fullWidth
            placeholder="alex.argos@argosai.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: { xs: 2, lg: 2.5 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#F9FAFB",
                height: 50,
              },
            }}
          />
          {/* SENHA */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 3,
                color: "#9CA3AF",
              }}
            >
              SENHA
            </Typography>

            <Typography
              sx={{
                fontSize: 13,
                color: "#69A7FF",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Esqueceu?
            </Typography>
          </Box>
          <TextField
            fullWidth
            type={showPassword ? "text" : "password"}
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            sx={{
              mb: 1.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                bgcolor: "#F9FAFB",
                height: 50,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* <FormControlLabel
            control={<Checkbox />}
            label="Lembrar por 30 dias"
            sx={{
              mb: { xs: 2, lg: 3 },
              color: "#4B5563",
              "& .MuiFormControlLabel-label": {
                fontSize: 14,
              },
            }}
          /> */}
          {/* BOTÃO */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            endIcon={<ArrowForwardIcon />}
            sx={{
              height: 50,
              borderRadius: 3,
              bgcolor: "#091227",
              fontSize: 16,
              fontWeight: 700,
              mt: "65px",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#111C35",
                boxShadow: "none",
              },
            }}
          >
            {loading ? "Entrando..." : "ENTRAR"}
          </Button>
          {/* DIVIDER */}
          <Box sx={{ my: { xs: 2, lg: 2.5 } }}>
            <Divider>
              <Typography
                sx={{
                  fontSize: 11,
                  color: "#9CA3AF",
                  fontWeight: 700,
                  letterSpacing: 2,
                }}
              >
                OU CONTINUE COM
              </Typography>
            </Divider>
          </Box>
          {/* SOCIAL */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              disabled
              startIcon={<GoogleIcon />}
              sx={{
                height: 46,
                borderRadius: 3,
                borderColor: "#E5E7EB",
                color: "#111827",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHubIcon />}
              disabled
              sx={{
                height: 46,
                borderRadius: 3,
                borderColor: "#E5E7EB",
                color: "#111827",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              GitHub
            </Button>
          </Box>
          {/* FOOTER */}
          <Typography
            sx={{
              mt: { xs: 3, lg: 4 },
              textAlign: "center",
              color: "#6B7280",
              fontSize: 14,
            }}
          >
            Não tem uma conta?{" "}
            <span
              style={{
                color: "#69A7FF",
                fontWeight: 700,
                // cursor: "pointer",
              }}
            >
              Criar conta
            </span>
          </Typography>
          {error && (
            <Typography
              color="error"
              sx={{
                mt: 2,
                textAlign: "center",
                fontSize: 14,
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
