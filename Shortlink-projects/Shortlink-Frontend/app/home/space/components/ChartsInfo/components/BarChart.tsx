'use client'

import { useEffect, useRef } from 'react'
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface BarChartProps {
  chartData: {
    xAxis: (string | number)[]
    value: number[]
  }
}

/**
 * BarChart Component
 * Converts Vue/ECharts BarChart to React/Recharts
 * Matches Vue: views/mySpace/components/chartsInfo/Barchart.vue
 */
export default function BarChart({ chartData }: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  // Transform data for Recharts format
  const data = chartData.xAxis.map((x, index) => ({
    name: String(x),
    value: chartData.value[index] || 0,
  }))

  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(180, 180, 180, 0.2)" />
          <XAxis
            dataKey="name"
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
            cursor={{ fill: 'rgba(180, 180, 180, 0.2)' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#83bff6" />
              <stop offset="50%" stopColor="#188df0" />
              <stop offset="100%" stopColor="#188df0" />
            </linearGradient>
          </defs>
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            barSize={10}
            fill="url(#barGradient)"
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
