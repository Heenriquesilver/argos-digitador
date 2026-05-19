// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../auth/useAuth";

// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   ToggleButton,
//   ToggleButtonGroup,
//   Paper,
// } from "@mui/material";

// import InputAdornment from "@mui/material/InputAdornment";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import IconButton from "@mui/material/IconButton";

// export default function LoginPage() {
//   const { loginPassword } = useAuth();
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [credential, setCredential] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       await loginPassword(email, credential);
//       navigate("/calculo");
//     } catch (err) {
//       console.error("ERRO LOGIN:", err);
//       setError("Falha no login. Verifique os dados.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         width: "100vw",
//         height: "100vh",
//         overflow: "hidden",
//       }}
//     >
//       {/* 🌌 BACKGROUND ESQUERDO */}
//       <Box
//         sx={{
//           flex: 1,
//           display: { xs: "none", md: "block" },
//           backgroundImage: "url('/images/bg-lexcalc.jpg')",
//           backgroundSize: "100% 100%",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       />

//       {/* 📦 PAINEL DO FORMULÁRIO (DIREITA) */}
//       <Box
//         sx={{
//           width: { xs: "100%", md: 420 },
//           height: "100vh",
//           bgcolor: "#f8fbff",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           boxShadow: "-8px 0 30px rgba(0,0,0,0.08)",
//         }}
//       >
//         <Paper
//           component="form"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleLogin();
//           }}
//           elevation={0}
//           sx={{
//             width: "100%",
//             maxWidth: 340,
//             textAlign: "center",
//             p: 2,
//             borderRadius: 4,
//             bgcolor: "transparent",
//           }}
//         >
//           {/* ESPAÇO PARA O LOGO */}
//           <Box sx={{ height: 80 }} />

//           <Box
//             component="img"
//             src="/images/bg-form-lexcalc.png"
//             alt="Logo LexCalc"
//             sx={{
//               width: 190,
//               height: "auto",
//               display: "block",
//               margin: "0 auto",
//               transform: "scale(2.0)",
//               transformOrigin: "center",
//               mb: 13,
//             }}
//           />
//           <ToggleButtonGroup
//             value="signin"
//             exclusive
//             fullWidth
//             sx={{
//               bgcolor: "#eef2ff",
//               borderRadius: 5,
//               "& .MuiToggleButton-root": { border: "none", borderRadius: 5 },
//               "& .Mui-selected": {
//                 bgcolor: "#5c6cff !important",
//                 color: "#fff !important",
//                 boxShadow: "0 2px 8px rgba(92,108,255,0.35)",
//                 "&:hover": {
//                   bgcolor: "#5c6cff",
//                 },
//               },
//             }}
//           >
//             <ToggleButton value="signin">Conectar</ToggleButton>
//             <ToggleButton value="signup">Cadastrar</ToggleButton>
//           </ToggleButtonGroup>
//           {/* EMAIL */}
//           <Box mt={3}>
//             <Typography textAlign="left" fontSize={14} mb={1}>
//               E-mail
//             </Typography>
//             <TextField
//               fullWidth
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               sx={{ bgcolor: "#fff", borderRadius: 3 }}
//             />
//           </Box>

//           <Box mt={2}>
//             <Typography textAlign="left" fontSize={14} mb={1}>
//               Senha
//             </Typography>
//             <TextField
//               type={showPassword ? "text" : "password"}
//               fullWidth
//               value={credential}
//               onChange={(e) => setCredential(e.target.value)}
//               sx={{ bgcolor: "#fff", borderRadius: 3 }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={() => setShowPassword((prev) => !prev)}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Box>
//           <Box mt={1} textAlign="right">
//             <Typography fontSize={13} color="#5c6cff">
//               Esqueceu a senha ?
//             </Typography>
//           </Box>
//           <Button
//             fullWidth
//             variant="contained"
//             type="submit"
//             sx={{
//               mt: 2,
//               bgcolor: "#5c6cff",
//               py: 1.5,
//               borderRadius: 5,
//               textTransform: "none",
//               fontSize: 16,
//             }}
//             onClick={handleLogin}
//             disabled={loading}
//           >
//             {loading ? "loading..." : "Entrar"}
//           </Button>
//           <Typography mt={1.5} fontSize={12} color="gray" textAlign="center">
//             Versão 3.2026.04.28
//           </Typography>
//           {error && (
//             <Typography color="error" fontSize={14}>
//               {error}
//             </Typography>
//           )}
//           {/* <Typography fontSize={12} mt={3} color="gray">
//             By continuing, you agree to our Terms of Service and Privacy Policy.
//           </Typography> */}
//         </Paper>
//       </Box>
//     </Box>
//   );
// }
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
      navigate("/calculos");
    } catch (err) {
      console.error("ERRO LOGIN:", err);
      setError("Dados inválidos para Conexão.");
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
      {/* 🌌 LADO ESQUERDO */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "block" },
          backgroundImage: "url('/images/bg-lexcalc.jpg')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      {/* 📦 FORMULÁRIO */}
      <Box
        sx={{
          width: { xs: "100%", sm: 360, md: 420 },
          height: "100vh",
          px: { xs: 2, sm: 3 },
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
            maxWidth: { xs: 280, sm: 320, md: 340 },
            textAlign: "center",
            p: { xs: 1.5, sm: 2 },
            borderRadius: 4,
            bgcolor: "transparent",
          }}
        >
          {/* LOGO */}
          <Box
            component="img"
            src="/images/bg-form-lexcalc.png"
            alt="Logo"
            sx={{
              width: { xs: 140, sm: 180, md: 280 },
              height: "auto",
              display: "block",
              margin: "0 auto",
              mb: { xs: 2, sm: 3, md: 4 },
            }}
          />

          {/* TOGGLE */}
          <ToggleButtonGroup
            value="signin"
            exclusive
            fullWidth
            sx={{
              bgcolor: "#eef2ff",
              borderRadius: 5,
              "& .MuiToggleButton-root": {
                border: "none",
                borderRadius: 5,
                fontSize: { xs: 12, sm: 13, md: 14 },
                py: { xs: 0.8, sm: 1 },
              },
              "& .Mui-selected": {
                bgcolor: "#5c6cff !important",
                color: "#fff !important",
                boxShadow: "0 2px 8px rgba(92,108,255,0.35)",
              },
            }}
          >
            <ToggleButton value="signin">Conectar</ToggleButton>
            <ToggleButton value="signup">Cadastrar</ToggleButton>
          </ToggleButtonGroup>

          {/* EMAIL */}
          <Box mt={{ xs: 2, sm: 3 }}>
            <Typography
              textAlign="left"
              fontSize={{ xs: 12, sm: 13, md: 14 }}
              mb={1}
            >
              E-mail
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ bgcolor: "#fff", borderRadius: 3 }}
            />
          </Box>

          {/* SENHA */}
          <Box mt={{ xs: 1.5, sm: 2 }}>
            <Typography
              textAlign="left"
              fontSize={{ xs: 12, sm: 13, md: 14 }}
              mb={1}
            >
              Senha
            </Typography>
            <TextField
              type={showPassword ? "text" : "password"}
              fullWidth
              size="small"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              sx={{ bgcolor: "#fff", borderRadius: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* ESQUECEU SENHA */}
          <Box mt={1} textAlign="right">
            <Typography fontSize={{ xs: 11, sm: 12, md: 13 }} color="#5c6cff">
              Esqueceu a senha?
            </Typography>
          </Box>

          {/* BOTÃO */}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            onClick={handleLogin}
            disabled={loading}
            sx={{
              mt: { xs: 1.5, sm: 2 },
              bgcolor: "#5c6cff",
              py: { xs: 1, sm: 1.2, md: 1.5 },
              borderRadius: 5,
              textTransform: "none",
              fontSize: { xs: 13, sm: 14, md: 16 },
            }}
          >
            {loading ? "Carregando..." : "Entrar"}
          </Button>

          {/* VERSÃO */}
          <Typography
            mt={1.5}
            fontSize={{ xs: 10, sm: 11, md: 12 }}
            color="gray"
          >
            Versão 3.2026.05.12
          </Typography>

          {/* ERRO */}
          {error && (
            <Typography
              color="error"
              fontSize={{ xs: 12, sm: 13, md: 14 }}
              mt={1}
            >
              {error}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
