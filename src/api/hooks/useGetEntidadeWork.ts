import { useEffect, useState } from "react";
import { entidadeService } from "../entidadeService";
import { type ConexaoSocialOutput } from "../types";

export default function useGetEntidadeWork() {
  const [data, setData] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await entidadeService.getUserWorkingEntity();

        const entidadeId = result?.elements?.[0]?.entidadePai?.id ?? null;

        setData(entidadeId);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
