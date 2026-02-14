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
  day: string;
  tokens: number;
}

const data: UsageData[] = [
  { day: "Mon", tokens: 400 },
  { day: "Tue", tokens: 700 },
  { day: "Wen", tokens: 600 },
  { day: "Thu", tokens: 300 },
  { day: "Fri", tokens: 800 },
  { day: "Sat", tokens: 200 },
  { day: "Sun", tokens: 250 },
];

export default function UsageChart() {
  return (
    <Card>
      <CardContent>
        <Typography fontWeight={600} mb={1}>
          Usage Overview (7 days)
        </Typography>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tokens" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
