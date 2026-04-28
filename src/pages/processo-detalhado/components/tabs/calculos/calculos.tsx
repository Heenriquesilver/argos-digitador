import { Box, TextField } from "@mui/material";

const Calculos = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%", // 👈 usa a altura do container pai
        display: "flex",
      }}
    >
      <TextField
        placeholder="Digite aqui..."
        variant="outlined"
        multiline
        fullWidth
        sx={{
          height: "50vh",
          "& .MuiInputBase-root": {
            height: "50vh",
            alignItems: "flex-start", // texto começa no topo
          },
          "& textarea": {
            height: "50vh !important",
          },
        }}
      />
    </Box>
  );
};

export default Calculos;
