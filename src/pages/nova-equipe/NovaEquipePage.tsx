import {
  Box,
  Typography,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import SnackInfo from "../../components/snack-info/SnackInfo";
import useGetEntidadeWork from "../../api/hooks/useGetEntidadeWork";

interface TLider {
  id: number;
  nome: string;
}

export default function NovaEquipePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [titulo, setTitulo] = useState("");
  const [lider, setLider] = useState<TLider | null>(null);
  const [lideres, setLideres] = useState<TLider[]>([]);
  const [loading, setLoading] = useState(false);
  const [buscaLider, setBuscaLider] = useState("");
  const [filialId, setFilialId] = useState<number | null>(null);

  const { data: idEntidadeWork } = useGetEntidadeWork();

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackType, setSnackType] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const showSnack = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setSnackMessage(message);
    setSnackType(type);
    setSnackOpen(true);
  };

  useEffect(() => {
    if (!idEntidadeWork) return;

    const fetchFilial = async () => {
      try {
        const response = await api.get(
          `/api/v1/pessoa_juridica/entidade/${idEntidadeWork}`,
        );

        setFilialId(response.data.id);
      } catch (error) {
        console.error("Erro ao buscar filial", error);
        showSnack("Erro ao buscar filial", "error");
      }
    };

    fetchFilial();
  }, [idEntidadeWork]);

  useEffect(() => {
    if (!id) return;

    const fetchEquipe = async () => {
      try {
        const response = await api.get(`/api/v1/equipe/${id}`);
        const data = response.data;

        setTitulo(data.titulo);

        if (data.lider) {
          setLider({
            id: data.lider.id,
            nome: data.lider.nome,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar equipe", error);
        showSnack("Erro ao carregar equipe", "error");
      }
    };

    fetchEquipe();
  }, [id]);

  useEffect(() => {
    if (!idEntidadeWork) return;

    const timeout = setTimeout(async () => {
      try {
        const response = await api.get("/api/v1/pessoa_fisica/termo", {
          params: {
            termo: buscaLider,
            entidade_pai: idEntidadeWork,
            page: 0,
            size: 10,
          },
        });

        const data = response.data?.elements || [];

        setLideres(
          data.map((item: any) => ({
            id: item.id,
            nome: item.nome,
          })),
        );
      } catch (error) {
        console.log("erro ao buscar lideres", error);
        showSnack("Erro ao buscar líderes", "error");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [buscaLider, idEntidadeWork]);

  const salvarEquipe = async () => {
    try {
      if (!titulo) {
        showSnack("Informe o título", "warning");
        return;
      }

      if (!lider) {
        showSnack("Selecione um líder", "warning");
        return;
      }

      setLoading(true);

      const payload = {
        titulo,
        lider: lider.id,
        filial: filialId,
      };

      if (isEdit) {
        await api.put(`/api/v1/equipe/${id}`, payload);
        showSnack("Equipe atualizada com sucesso!", "success");
      } else {
        await api.post("/api/v1/equipe", payload);
        showSnack("Equipe criada com sucesso!", "success");
      }

      setTimeout(() => {
        navigate("/equipe");
      }, 1500);
    } catch (error) {
      console.error("Erro ao salvar equipe", error);
      showSnack("Erro ao salvar equipe", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight={600} mb={2} color="text.primary">
        {isEdit ? "Editar Equipe" : "Nova Equipe"}
      </Typography>

      <Grid container spacing={2}>
        {/* Título */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Título"
            fullWidth
            value={titulo}
            onChange={(e) => setTitulo(e.target.value.toLocaleUpperCase())}
          />
        </Grid>

        {/* Líder */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            options={lideres}
            getOptionLabel={(option) => option.nome || ""}
            value={lider}
            onChange={(_, newValue) => setLider(newValue)}
            onInputChange={(_, newInput) => setBuscaLider(newInput)}
            loading={loading}
            noOptionsText="Nenhum resultado"
            renderInput={(params) => (
              <TextField {...params} label="Líder" fullWidth />
            )}
          />
        </Grid>

        {/* Botões */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => navigate("/equipe")}>Cancelar</Button>

            <Button
              variant="contained"
              onClick={salvarEquipe}
              disabled={!titulo || !lider || loading}
              sx={{ bgcolor: "#30B2E4" }}
            >
              {isEdit ? "Atualizar" : "Salvar"}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <SnackInfo
        open={snackOpen}
        message={snackMessage}
        type={snackType}
        onClose={() => setSnackOpen(false)}
      />
    </Box>
  );
}
