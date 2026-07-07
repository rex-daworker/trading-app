import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

export interface AllocationSlice {
  name: string
  value: number
}

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
]
const CASH_COLOR = '#94a3b8'

function colorFor(entry: AllocationSlice, i: number) {
  return entry.name === 'Cash' ? CASH_COLOR : COLORS[i % COLORS.length]
}

interface AllocationDonutProps {
  data: AllocationSlice[]
  format: (n: number) => string
}

function AllocationDonut({ data, format }: AllocationDonutProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="h-64 w-full sm:w-1/2">
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
                <Cell key={entry.name} fill={colorFor(entry, i)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => {
                const n = Number(value)
                const pct = total > 0 ? ((n / total) * 100).toFixed(1) : '0'
                return `${format(n)} (${pct}%)`
              }}
              contentStyle={{
                background: '#111827',
                border: '1px solid #374151',
                borderRadius: 8,
                color: '#f9fafb',
                fontSize: 12,
              }}
              itemStyle={{ color: '#f9fafb' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="flex-1 space-y-2">
        {data.map((entry, i) => {
          const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0'
          return (
            <li key={entry.name} className="flex min-w-0 items-center justify-between gap-2 text-sm">
              <span className="flex shrink-0 items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ background: colorFor(entry, i) }}
                />
                <span className="font-medium">{entry.name}</span>
              </span>
              <span className="truncate text-right text-gray-500 dark:text-gray-400">
                {format(entry.value)} · {pct}%
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AllocationDonut