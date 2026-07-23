import { useState } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Candle } from "../api/alphavantage";

interface CandlestickChartProps {
  data: Candle[];
  format: (n: number) => string;
}

interface CandleShapeProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: Candle;
}

function CandleShape(props: CandleShapeProps) {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props;
  if (!payload) return null;

  const { o, h, l, c } = payload;
  const up = c >= o;
  const color = up ? "#16a34a" : "#dc2626";
  const range = h - l;
  const scale = range === 0 ? 0 : height / range;

  const openY = y + (h - o) * scale;
  const closeY = y + (h - c) * scale;
  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.max(Math.abs(closeY - openY), 1);
  const wickX = x + width / 2;
  const bodyWidth = Math.max(width * 0.6, 2);
  const bodyX = x + (width - bodyWidth) / 2;

  return (
    <g>
      <line
        x1={wickX}
        x2={wickX}
        y1={y}
        y2={y + height}
        stroke={color}
        strokeWidth={1}
      />
      <rect
        x={bodyX}
        y={bodyTop}
        width={bodyWidth}
        height={bodyHeight}
        fill={color}
      />
    </g>
  );
}

function formatDate(t: number) {
  return new Date(t * 1000).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const RANGES = [
  { label: "1M", days: 22 },
  { label: "3M", days: 66 },
  { label: "All", days: Infinity },
] as const;

function CandlestickChart({ data, format }: CandlestickChartProps) {
  const [rangeIdx, setRangeIdx] = useState(2);
  const range = RANGES[rangeIdx];
  const sliced = range.days === Infinity ? data : data.slice(-range.days);

  return (
    <div>
      <div className="mb-2 flex gap-1">
        {RANGES.map((r, i) => (
          <button
            key={r.label}
            onClick={() => setRangeIdx(i)}
            className={`rounded-md border px-2 py-0.5 text-xs ${
              i === rangeIdx
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "border-gray-300 text-gray-500 dark:border-gray-600"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={sliced}
            margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              opacity={0.1}
            />
            <XAxis
              dataKey="t"
              tickFormatter={formatDate}
              tick={{ fontSize: 10 }}
              minTickGap={30}
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 10 }}
              width={50}
              tickFormatter={(v: number) => format(v)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload as Candle;
                return (
                  <div className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-100 shadow-lg">
                    <div className="mb-1 font-medium">{formatDate(d.t)}</div>
                    <div>
                      O {format(d.o)} · H {format(d.h)} · L {format(d.l)} · C{" "}
                      {format(d.c)}
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey={(d: Candle) => [d.l, d.h]} shape={CandleShape} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CandlestickChart;
