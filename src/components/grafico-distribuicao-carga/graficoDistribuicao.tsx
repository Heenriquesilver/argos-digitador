import { Card, CardContent, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UsageData {
  label: string;
  value: number;
}

interface Props {
  data: UsageData[];
  title?: string;
}

export default function GraficoDistribuicao({ data, title }: Props) {
  return (
    <Card sx={{ boxShadow: "none", border: "1px solid #eee" }}>
      <CardContent>
        <Typography fontWeight={600} mb={1}>
          {title}
        </Typography>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
