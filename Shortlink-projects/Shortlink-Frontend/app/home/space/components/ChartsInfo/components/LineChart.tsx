'use client'

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'

interface LineChartProps {
  data: Array<{
    date: string
    pv: number
    uv: number
    uip: number
  }>
  style?: React.CSSProperties
}

/**
 * LineChart Component
 * Displays line chart for visit trends
 * Matches Vue: views/mySpace/components/chartsInfo line chart (ECharts)
 */
export default function LineChart({ data, style }: LineChartProps) {
  return (
    <div style={{ ...style, width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(180, 180, 180, 0.2)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#ababab' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#ababab' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="pv"
            name="Page Views"
            stroke="#83bff6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="uv"
            name="Unique Visitors"
            stroke="#188df0"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="uip"
            name="Unique IPs"
            stroke="#52c41a"
            strokeWidth={2}
            dot={false}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
