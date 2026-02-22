import type { Meta, StoryObj } from '@storybook/react'
import KeyValue from './KeyValue'

const meta: Meta<typeof KeyValue> = {
  title: 'Components/ChartsInfo/KeyValue',
  component: KeyValue,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof KeyValue>

export const Default: Story = {
  args: {
    dataLists: [
      { ip: '192.168.1.1', cnt: 50 },
      { ip: '192.168.1.2', cnt: 40 },
      { ip: '192.168.1.3', cnt: 30 },
      { ip: '192.168.1.4', cnt: 20 },
      { ip: '192.168.1.5', cnt: 10 },
    ],
  },
}

export const WithNames: Story = {
  args: {
    dataLists: [
      { name: 'Chrome', cnt: 600 },
      { name: 'Safari', cnt: 300 },
      { name: 'Firefox', cnt: 200 },
      { name: 'Edge', cnt: 134 },
    ],
  },
}

export const WithValues: Story = {
  args: {
    dataLists: [
      { name: 'CN', value: 500 },
      { name: 'US', value: 300 },
      { name: 'JP', value: 200 },
      { name: 'KR', value: 100 },
    ],
  },
}

export const Empty: Story = {
  args: {
    dataLists: [],
  },
}

export const ManyItems: Story = {
  args: {
    dataLists: Array.from({ length: 20 }, (_, i) => ({
      ip: `192.168.1.${i + 1}`,
      cnt: 100 - i * 5,
    })),
  },
}
