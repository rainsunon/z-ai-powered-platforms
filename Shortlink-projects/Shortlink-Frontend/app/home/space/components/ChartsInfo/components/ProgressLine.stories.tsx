import type { Meta, StoryObj } from '@storybook/react'
import ProgressLine from './ProgressLine'

const meta: Meta<typeof ProgressLine> = {
  title: 'Components/ChartsInfo/ProgressLine',
  component: ProgressLine,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ProgressLine>

export const BrowserStats: Story = {
  args: {
    dataLists: [
      { browser: 'Chrome', cnt: 600, ratio: 0.48 },
      { browser: 'Safari', cnt: 300, ratio: 0.24 },
      { browser: 'Firefox', cnt: 200, ratio: 0.16 },
      { browser: 'Edge', cnt: 134, ratio: 0.11 },
    ],
  },
}

export const OSStats: Story = {
  args: {
    dataLists: [
      { os: 'Windows', cnt: 400, ratio: 0.32 },
      { os: 'macOS', cnt: 300, ratio: 0.24 },
      { os: 'Linux', cnt: 200, ratio: 0.16 },
      { os: 'iOS', cnt: 200, ratio: 0.16 },
      { os: 'Android', cnt: 134, ratio: 0.11 },
    ],
  },
}

export const WithNames: Story = {
  args: {
    dataLists: [
      { name: 'Desktop', cnt: 700, ratio: 0.56 },
      { name: 'Mobile', cnt: 400, ratio: 0.32 },
      { name: 'Tablet', cnt: 134, ratio: 0.11 },
    ],
  },
}

export const Empty: Story = {
  args: {
    dataLists: [],
  },
}
