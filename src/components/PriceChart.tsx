import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'

export interface PricePoint {
  t: number
  price: number
}

interface PriceChartProps {
  data: PricePoint[]
  up: boolean
}

function PriceChart({ data, up }: PriceChartProps) {
  const color = up ? '#16a34a' : '#dc2626'

  return (
    <ResponsiveContainer width="100%" height={120}>
      <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
        <YAxis domain={['dataMin', 'dataMax']} hide />
        <Area
          type="monotone"
          dataKey="price"
          stroke={color}
          fill={color}
          fillOpacity={0.12}
          strokeWidth={2}
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default PriceChart