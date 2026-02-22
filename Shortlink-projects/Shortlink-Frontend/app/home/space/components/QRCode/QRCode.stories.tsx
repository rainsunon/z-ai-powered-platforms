import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from 'antd'
import QRCode from './QRCode'

const meta: Meta<typeof QRCode> = {
  title: 'Components/QRCode',
  component: QRCode,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof QRCode>

// Wrapper component to manage modal state
const QRCodeWrapper = (args: any) => {
  const [visible, setVisible] = useState(true)
  return (
    <>
      <Button onClick={() => setVisible(true)}>Show QR Code</Button>
      <QRCode {...args} visible={visible} onClose={() => setVisible(false)} />
    </>
  )
}

export const Default: Story = {
  render: (args) => <QRCodeWrapper {...args} />,
  args: {
    url: 'https://example.com/short-link-abc123',
    size: 200,
  },
}

export const LongUrl: Story = {
  render: (args) => <QRCodeWrapper {...args} />,
  args: {
    url: 'https://very-long-domain-name.example.com/path/to/resource?query=parameter&another=value',
    size: 200,
  },
}

export const SmallSize: Story = {
  render: (args) => <QRCodeWrapper {...args} />,
  args: {
    url: 'https://example.com/short-link',
    size: 150,
  },
}

export const LargeSize: Story = {
  render: (args) => <QRCodeWrapper {...args} />,
  args: {
    url: 'https://example.com/short-link',
    size: 300,
  },
}
