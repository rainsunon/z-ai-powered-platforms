import type { Meta, StoryObj } from '@storybook/react'
import ProgressPie from './ProgressPie'

const meta: Meta<typeof ProgressPie> = {
  title: 'Components/ChartsInfo/ProgressPie',
  component: ProgressPie,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ProgressPie>

export const NewVsReturning: Story = {
  args: {
    labels: ['New Visitors', 'Returning Visitors'],
    data: [600, 634],
  },
}

export const MobileVsDesktop: Story = {
  args: {
    labels: ['Mobile', 'Desktop'],
    data: [400, 700],
  },
}

export const WiFiVsCellular: Story = {
  args: {
    labels: ['WiFi', '4G/5G'],
    data: [800, 300],
  },
}

export const EqualData: Story = {
  args: {
    labels: ['Option A', 'Option B'],
    data: [500, 500],
  },
}

export const ZeroData: Story = {
  args: {
    labels: ['Data 1', 'Data 2'],
    data: [0, 0],
  },
}
