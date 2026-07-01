import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface AllocationSlice {
  name: string;
  value: number;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];
const CASH_COLOR = "#94a3b8";

interface AllocationDonutProps {
  data: AllocationSlice[];
  format: (n: number) => string;
}

function AllocationDonut({ data, format }: AllocationDonutProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.name}
                fill={
                  entry.name === "Cash" ? CASH_COLOR : COLORS[i % COLORS.length]
                }
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => {
              const n = Number(value);
              const pct = total > 0 ? ((n / total) * 100).toFixed(1) : "0";
              return `${format(n)} (${pct}%)`;
            }}
            contentStyle={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: 8,
              color: "#f9fafb",
              fontSize: 12,
            }}
            itemStyle={{ color: "#f9fafb" }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AllocationDonut;
