import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from 'antd'
import CreateLinks from './CreateLinks'
import type { Group } from '@/src/api/types'

// Mock group data
const mockGroups: Group[] = [
  {
    gid: 'group1',
    name: 'Default Group',
    title: 'Default Group',
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    gid: 'group2',
    name: 'Marketing',
    title: 'Marketing',
    sortOrder: 2,
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    gid: 'group3',
    name: 'Development',
    title: 'Development',
    sortOrder: 3,
    createdAt: '2024-01-03T00:00:00Z',
  },
]

const meta: Meta<typeof CreateLinks> = {
  title: 'Components/CreateLinks',
  component: CreateLinks,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story, context) => (
      <Modal
        title="Batch Create Links"
        open={true}
        onCancel={() => {
          console.log('Modal cancelled')
        }}
        footer={null}
        width={800}
      >
        <Story {...context} />
      </Modal>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CreateLinks>

export const Default: Story = {
  args: {
    groupInfo: mockGroups,
    defaultGid: 'group1',
    onSubmit: () => {
      console.log('Form submitted')
    },
    onCancel: () => {
      console.log('Form cancelled')
    },
  },
}

export const WithDefaultGroup: Story = {
  args: {
    groupInfo: mockGroups,
    defaultGid: 'group2',
    onSubmit: () => {
      console.log('Form submitted')
    },
    onCancel: () => {
      console.log('Form cancelled')
    },
  },
}

export const EmptyGroups: Story = {
  args: {
    groupInfo: [],
    onSubmit: () => {
      console.log('Form submitted')
    },
    onCancel: () => {
      console.log('Form cancelled')
    },
  },
}
