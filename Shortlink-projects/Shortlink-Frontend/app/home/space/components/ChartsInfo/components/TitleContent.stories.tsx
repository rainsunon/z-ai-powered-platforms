import type { Meta, StoryObj } from '@storybook/react'
import { Button } from 'antd'
import TitleContent from './TitleContent'

const meta: Meta<typeof TitleContent> = {
  title: 'Components/ChartsInfo/TitleContent',
  component: TitleContent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof TitleContent>

export const Default: Story = {
  args: {
    title: 'Chart Title',
    children: (
      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '4px' }}>
        Chart content goes here
      </div>
    ),
  },
}

export const WithButton: Story = {
  args: {
    title: 'Chart Title',
    titleButton: <Button size="small">Action</Button>,
    children: (
      <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '4px' }}>
        Chart content with action button
      </div>
    ),
  },
}

export const WithCustomContent: Story = {
  args: {
    title: 'Visit Statistics',
    children: (
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>1,234</div>
            <div style={{ color: '#999' }}>Total Visits</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>56</div>
            <div style={{ color: '#999' }}>Today</div>
          </div>
        </div>
      </div>
    ),
  },
}
