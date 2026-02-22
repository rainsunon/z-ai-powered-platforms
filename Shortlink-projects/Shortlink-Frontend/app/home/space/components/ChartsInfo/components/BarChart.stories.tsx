import type { Meta, StoryObj } from '@storybook/react'
import BarChart from './BarChart'

const meta: Meta<typeof BarChart> = {
  title: 'Components/ChartsInfo/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof BarChart>

export const Default: Story = {
  args: {
    chartData: {
      xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      value: [100, 120, 150, 180, 200, 220, 264],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '300px' }}>
        <Story />
      </div>
    ),
  ],
}

export const HourlyData: Story = {
  args: {
    chartData: {
      xAxis: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      value: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240],
    },
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
    chartData: {
      xAxis: [],
      value: [],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '300px' }}>
        <Story />
      </div>
    ),
  ],
}
