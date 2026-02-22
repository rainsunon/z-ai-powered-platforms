import type { Meta, StoryObj } from '@storybook/react'
import LineChart from './LineChart'

const meta: Meta<typeof LineChart> = {
  title: 'Components/ChartsInfo/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof LineChart>

export const Default: Story = {
  args: {
    data: [
      { date: '2024-01-01', pv: 100, uv: 80, uip: 70 },
      { date: '2024-01-02', pv: 120, uv: 90, uip: 75 },
      { date: '2024-01-03', pv: 150, uv: 110, uip: 85 },
      { date: '2024-01-04', pv: 180, uv: 130, uip: 95 },
      { date: '2024-01-05', pv: 200, uv: 150, uip: 105 },
      { date: '2024-01-06', pv: 220, uv: 170, uip: 115 },
      { date: '2024-01-07', pv: 264, uv: 200, uip: 125 },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const MonthlyData: Story = {
  args: {
    data: Array.from({ length: 30 }, (_, i) => ({
      date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      pv: 100 + i * 10,
      uv: 80 + i * 8,
      uip: 70 + i * 7,
    })),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px', height: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export const EmptyData: Story = {
  args: {
    data: [],
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '300px' }}>
        <Story />
      </div>
    ),
  ],
}
