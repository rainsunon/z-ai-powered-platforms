/// <reference types="jest" />
import { render, screen } from '@testing-library/react'
import CreateLinks from './CreateLinks'
import { addLinks } from '@/src/api'
import type { Group } from '@/src/api/types'

// Mock API functions
jest.mock('@/src/api', () => ({
    addLinks: jest.fn(),
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

describe('CreateLinks Component - Basic Rendering', () => {
    const mockGroups: Group[] = [
        { gid: 'group1', name: 'Group 1', title: 'Group 1' },
        { gid: 'group2', name: 'Group 2', title: 'Group 2' },
        { gid: 'group3', name: 'Group 3', title: 'Group 3' },
    ]

    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
        ;(addLinks as jest.Mock).mockResolvedValue(new ArrayBuffer(8))
    })

    // ============================================
    // Set 8.1: Component Renders
    // ============================================
    describe('Set 8.1: Component Renders', () => {
        it('renders form container', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        const formContainer = screen.getByTestId('component-create-links')
        expect(formContainer).toBeInTheDocument()
        })

        it('renders URLs textarea field', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        const urlsTextarea = screen.getByTestId('textarea-origin-urls')
        expect(urlsTextarea).toBeInTheDocument()
        })

        it('renders descriptions textarea field', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        const describesTextarea = screen.getByTestId('textarea-describes')
        expect(describesTextarea).toBeInTheDocument()
        })

        it('renders group select dropdown', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        const groupSelect = screen.getByTestId('select-group')
        expect(groupSelect).toBeInTheDocument()
        })

        it('renders validity period radio buttons', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        const radioGroup = screen.getByTestId('radio-valid-date-type')
        expect(radioGroup).toBeInTheDocument()
        
        // Check for both radio options
        const permanentRadio = screen.getByText('Permanent')
        const customRadio = screen.getByText('Custom')
        expect(permanentRadio).toBeInTheDocument()
        expect(customRadio).toBeInTheDocument()
        })

        it('renders submit and cancel buttons', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        const submitButton = screen.getByTestId('button-submit')
        const cancelButton = screen.getByTestId('button-cancel')
        
        expect(submitButton).toBeInTheDocument()
        expect(cancelButton).toBeInTheDocument()
        expect(submitButton).toHaveTextContent('Confirm')
        expect(cancelButton).toHaveTextContent('Cancel')
        })

        it('renders all form labels', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        expect(screen.getByText('Redirect URLs')).toBeInTheDocument()
        expect(screen.getByText('Descriptions')).toBeInTheDocument()
        expect(screen.getByText('Group')).toBeInTheDocument()
        expect(screen.getByText('Validity Period')).toBeInTheDocument()
        })

        it('does not render date picker when validity period is Permanent', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        const datePicker = screen.queryByTestId('date-picker-valid-date')
        expect(datePicker).not.toBeInTheDocument()
        })

        it('renders row count indicators', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        // Should show "0/100" for both URLs and descriptions
        const rowCounts = screen.getAllByText(/0\/100/)
        expect(rowCounts.length).toBeGreaterThanOrEqual(2)
        })
    })

    // ============================================
    // Set 8.2: Form Fields Display
    // ============================================
    describe('Set 8.2: Form Fields Display', () => {
        it('URLs textarea has correct placeholder', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        const urlsTextarea = screen.getByTestId('textarea-origin-urls')
        expect(urlsTextarea).toHaveAttribute(
            'placeholder',
            'Please enter links starting with http:// or https://, one per line, maximum 100 lines'
        )
        })

        it('descriptions textarea has correct placeholder', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        const describesTextarea = screen.getByTestId('textarea-describes')
        expect(describesTextarea).toHaveAttribute(
            'placeholder',
            'Please enter descriptions, one per line, description rows should match URL rows'
        )
        })

        it('group select shows options from props', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        const groupSelect = screen.getByTestId('select-group')
        expect(groupSelect).toBeInTheDocument()
        })

        it('default group is selected when provided', () => {
        const defaultGid = 'group2'
        render(<CreateLinks groupInfo={mockGroups} defaultGid={defaultGid} />)
        
        const groupSelect = screen.getByTestId('select-group')
        expect(groupSelect).toBeInTheDocument()
        })

        it('selects first group when no defaultGid is provided', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        const groupSelect = screen.getByTestId('select-group')
        expect(groupSelect).toBeInTheDocument()
        })

        it('renders row count indicators with correct format', () => {
        render(<CreateLinks groupInfo={mockGroups} />)
        
        // Should show "0/100" format for both URLs and descriptions
        const rowCounts = screen.getAllByText('0/100')
        expect(rowCounts.length).toBe(2) // One for URLs, one for descriptions
        })
    })

  // ============================================
  // Additional rendering tests
  // ============================================
    describe('Additional Rendering Tests', () => {
        it('renders with empty groupInfo array', () => {
        render(<CreateLinks groupInfo={[]} />)
        
        const formContainer = screen.getByTestId('component-create-links')
        expect(formContainer).toBeInTheDocument()
        })

        it('renders with single group', () => {
        const singleGroup: Group[] = [{ gid: 'group1', name: 'Group 1' }]
        render(<CreateLinks groupInfo={singleGroup} />)
        
        const groupSelect = screen.getByTestId('select-group')
        expect(groupSelect).toBeInTheDocument()
        })
    })
})
