import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from 'antd'
import CreateLink from './CreateLink'
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

const meta: Meta<typeof CreateLink> = {
  title: 'Components/CreateLink',
  component: CreateLink,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  // Default decorator: wrap all stories in Modal
  decorators: [
    (Story, context) => (
      <Modal
        title="Create Link"
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
type Story = StoryObj<typeof CreateLink>

// Story: Default with first group selected
export const Default: Story = {
  args: {
    groupInfo: mockGroups,
    isSingle: true,
    defaultGid: 'group1',
    onSubmit: () => {
      console.log('Form submitted')
    },
    onCancel: () => {
      console.log('Form cancelled')
    },
  },
}

// Story: With default group selected
export const WithDefaultGroup: Story = {
  args: {
    groupInfo: mockGroups,
    isSingle: true,
    defaultGid: 'group2', // Marketing group selected by default
    onSubmit: () => {
      console.log('Form submitted')
    },
    onCancel: () => {
      console.log('Form cancelled')
    },
  },
}

// Story: Empty groups (edge case)
export const EmptyGroups: Story = {
  args: {
    groupInfo: [],
    isSingle: true,
    onSubmit: () => {
      console.log('Form submitted')
    },
    onCancel: () => {
      console.log('Form cancelled')
    },
  },
}
