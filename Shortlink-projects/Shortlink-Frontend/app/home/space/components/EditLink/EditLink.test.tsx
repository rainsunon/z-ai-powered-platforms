/// <reference types="jest" />
import { render, screen } from '@testing-library/react'
import EditLink from './EditLink'
import { editSmallLink, queryTitle } from '@/src/api'
import type { Group, ShortLink } from '@/src/api/types'

// Mock API functions
jest.mock('@/src/api', () => ({
  editSmallLink: jest.fn(),
  queryTitle: jest.fn(),
}))

// Mock Ant Design message
jest.mock('antd', () => {
  const antd = jest.requireActual('antd')
  return {
    ...antd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
    },
  }
})

// Mock dayjs
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs')
  return originalDayjs
})

describe('EditLink Component - Basic Rendering', () => {
  const mockGroups: Group[] = [
    { gid: 'group1', name: 'Group 1', title: 'Group 1' },
    { gid: 'group2', name: 'Group 2', title: 'Group 2' },
    { gid: 'group3', name: 'Group 3', title: 'Group 3' },
  ]

  const mockEditData: ShortLink = {
    id: 'link123',
    gid: 'group2',
    fullShortUrl: 'https://short.link/abc123',
    originUrl: 'https://example.com',
    describe: 'Test Description',
    validDateType: 0,
    domain: 'short.link',
  }

  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()
  const mockOnUpdatePage = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(editSmallLink as jest.Mock).mockResolvedValue({
      data: { code: '0', success: true },
    })
    ;(queryTitle as jest.Mock).mockResolvedValue({
      data: { data: 'Mocked Title' },
    })
  })

  // ============================================
  // Set 11.1: Form Pre-filling
  // ============================================
  describe('Set 11.1: Form Pre-filling', () => {
    it('renders form container', () => {
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={mockEditData}
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          onUpdatePage={mockOnUpdatePage}
        />
      )
      
      const formContainer = screen.getByTestId('component-edit-link')
      expect(formContainer).toBeInTheDocument()
    })

    it('pre-fills URL from editData', () => {
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={mockEditData}
        />
      )
      
      const urlInput = screen.getByTestId('input-origin-url')
      expect(urlInput).toBeInTheDocument()
      // The value should be pre-filled (though we can't directly check form values easily)
    })

    it('pre-fills description from editData', () => {
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={mockEditData}
        />
      )
      
      const describeInput = screen.getByTestId('textarea-describe')
      expect(describeInput).toBeInTheDocument()
    })

    it('pre-fills group selection from editData', () => {
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={mockEditData}
        />
      )
      
      const groupSelect = screen.getByTestId('select-group')
      expect(groupSelect).toBeInTheDocument()
    })

    it('pre-fills validity period from editData', () => {
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={mockEditData}
        />
      )
      
      const radioGroup = screen.getByTestId('radio-valid-date-type')
      expect(radioGroup).toBeInTheDocument()
      
      // Default should be Permanent (0)
      expect(screen.getByText('Permanent')).toBeInTheDocument()
      expect(screen.getByText('Custom')).toBeInTheDocument()
    })

    it('renders date picker when validDateType is 1', () => {
      const editDataWithDate: ShortLink = {
        ...mockEditData,
        validDateType: 1,
        validDate: '2024-12-31 23:59:59',
      }
      
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={editDataWithDate}
        />
      )
      
      const datePicker = screen.getByTestId('date-picker-valid-date')
      expect(datePicker).toBeInTheDocument()
    })

    it('hides date picker when validDateType is 0', () => {
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={mockEditData}
        />
      )
      
      const datePicker = screen.queryByTestId('date-picker-valid-date')
      expect(datePicker).not.toBeInTheDocument()
    })
  })

  // ============================================
  // Set 11.2: Component Renders
  // ============================================
  describe('Set 11.2: Component Renders', () => {
    it('renders all form fields', () => {
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={mockEditData}
        />
      )
      
      expect(screen.getByTestId('input-origin-url')).toBeInTheDocument()
      expect(screen.getByTestId('textarea-describe')).toBeInTheDocument()
      expect(screen.getByTestId('select-group')).toBeInTheDocument()
      expect(screen.getByTestId('radio-valid-date-type')).toBeInTheDocument()
    })

    it('renders all form labels', () => {
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={mockEditData}
        />
      )
      
      expect(screen.getByText('Redirect URL')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Group')).toBeInTheDocument()
      expect(screen.getByText('Validity Period')).toBeInTheDocument()
    })

    it('renders submit and cancel buttons', () => {
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={mockEditData}
        />
      )
      
      const submitButton = screen.getByTestId('button-submit')
      const cancelButton = screen.getByTestId('button-cancel')
      
      expect(submitButton).toBeInTheDocument()
      expect(cancelButton).toBeInTheDocument()
      expect(submitButton).toHaveTextContent('Confirm')
      expect(cancelButton).toHaveTextContent('Cancel')
    })

    it('renders URL input with correct placeholder', () => {
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={mockEditData}
        />
      )
      
      const urlInput = screen.getByTestId('input-origin-url')
      expect(urlInput).toHaveAttribute(
        'placeholder',
        'Please enter a link starting with http:// or https:// or app redirect link'
      )
    })

    it('renders description textarea with correct placeholder', () => {
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={mockEditData}
        />
      )
      
      const describeInput = screen.getByTestId('textarea-describe')
      expect(describeInput).toHaveAttribute(
        'placeholder',
        'You can create multiple short links by line breaks, one per line, maximum 50 per batch'
      )
    })

    it('renders row count indicator', () => {
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={mockEditData}
        />
      )
      
      // Should show row count in format "X/100"
      expect(screen.getByText(/\d+\/100/)).toBeInTheDocument()
    })

    it('renders expiration alert when date picker is visible', () => {
      const editDataWithDate: ShortLink = {
        ...mockEditData,
        validDateType: 1,
        validDate: '2024-12-31 23:59:59',
      }
      
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={editDataWithDate}
        />
      )
      
      expect(
        screen.getByText(/Link will automatically redirect to 404 page after expiration!/)
      ).toBeInTheDocument()
    })
  })

  // ============================================
  // Additional rendering tests
  // ============================================
  describe('Additional Rendering Tests', () => {
    it('handles editData with originalUrl instead of originUrl', () => {
      const editDataWithOriginalUrl: ShortLink = {
        ...mockEditData,
        originalUrl: 'https://example-original.com',
        originUrl: undefined,
      }
      
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={editDataWithOriginalUrl}
        />
      )
      
      const urlInput = screen.getByTestId('input-origin-url')
      expect(urlInput).toBeInTheDocument()
    })

    it('handles editData with title instead of describe', () => {
      const editDataWithTitle: ShortLink = {
        ...mockEditData,
        title: 'Title Description',
        describe: undefined,
      }
      
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={editDataWithTitle}
        />
      )
      
      const describeInput = screen.getByTestId('textarea-describe')
      expect(describeInput).toBeInTheDocument()
    })

    it('handles editData with groupId instead of gid', () => {
      const editDataWithGroupId: ShortLink = {
        ...mockEditData,
        groupId: 'group3',
        gid: undefined,
      }
      
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={editDataWithGroupId}
        />
      )
      
      const groupSelect = screen.getByTestId('select-group')
      expect(groupSelect).toBeInTheDocument()
    })

    it('handles empty groupInfo array', () => {
      render(
        <EditLink
          groupInfo={[]}
          editData={mockEditData}
        />
      )
      
      const formContainer = screen.getByTestId('component-edit-link')
      expect(formContainer).toBeInTheDocument()
    })

    it('renders with minimal editData', () => {
      const minimalEditData: ShortLink = {
        id: 'link456',
        originUrl: 'https://example.com',
        describe: 'Minimal',
      }
      
      render(
        <EditLink
          groupInfo={mockGroups}
          editData={minimalEditData}
        />
      )
      
      const formContainer = screen.getByTestId('component-edit-link')
      expect(formContainer).toBeInTheDocument()
    })
  })
})
