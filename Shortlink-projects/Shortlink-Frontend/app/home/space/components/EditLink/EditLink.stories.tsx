import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from 'antd'
import EditLink from './EditLink'
import type { Group, ShortLink } from '@/src/api/types'

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

// Mock edit data
const mockEditData: ShortLink = {
  id: 'link1',
  gid: 'group1',
  shortCode: 'abc123',
  shortUri: 'abc123',
  fullShortUrl: 'https://short.link/abc123',
  originalUrl: 'https://example.com/very/long/url/path',
  originUrl: 'https://example.com/very/long/url/path',
  title: 'Example Link',
  describe: 'This is an example link description',
  groupId: 'group1',
  groupName: 'Default Group',
  visitCount: 42,
  status: 'active',
  createdAt: '2024-01-01T00:00:00Z',
  validDate: '2024-12-31 23:59:59',
  validDateType: 1,
}

const meta: Meta<typeof EditLink> = {
  title: 'Components/EditLink',
  component: EditLink,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story, context) => (
      <Modal
        title="Edit Link"
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
type Story = StoryObj<typeof EditLink>

export const Default: Story = {
  args: {
    groupInfo: mockGroups,
    editData: mockEditData,
    onSubmit: () => {
      console.log('Form submitted')
    },
    onCancel: () => {
      console.log('Form cancelled')
    },
    onUpdatePage: () => {
      console.log('Page updated')
    },
  },
}

export const PermanentLink: Story = {
  args: {
    groupInfo: mockGroups,
    editData: {
      ...mockEditData,
      validDateType: 0, // Permanent
      validDate: undefined,
    },
    onSubmit: () => {
      console.log('Form submitted')
    },
    onCancel: () => {
      console.log('Form cancelled')
    },
    onUpdatePage: () => {
      console.log('Page updated')
    },
  },
}

export const DifferentGroup: Story = {
  args: {
    groupInfo: mockGroups,
    editData: {
      ...mockEditData,
      gid: 'group2',
      groupId: 'group2',
      groupName: 'Marketing',
    },
    onSubmit: () => {
      console.log('Form submitted')
    },
    onCancel: () => {
      console.log('Form cancelled')
    },
    onUpdatePage: () => {
      console.log('Page updated')
    },
  },
}
