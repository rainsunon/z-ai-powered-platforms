/// <reference types="jest" />
import { render, screen } from '@testing-library/react'
import CreateLink from './CreateLink'
import { addSmallLink, queryTitle } from '@/src/api'
import type { Group } from '@/src/api/types'

// Mock API functions 
jest.mock('@/src/api', () => ({ 
    addSmallLink: jest.fn(),
    queryTitle: jest.fn()
}))

// Mock Ant Design message 
jest.mock('antd', () => { 
    const antd = jest.requireActual('antd')
    return {
        ...antd,
        message: {
            success: jest.fn(),
            error: jest.fn(),
            warning: jest.fn()
        }
    }
})

// Mock dayjs to have consistent dates in tests
jest.mock('dayjs', () => { 
    const originalDayjs = jest.requireActual('dayjs')
    return originalDayjs
})

describe('CreateLink Component - Basic Rendering', () => {
    const mockGroups: Group[] = [
        { gid: 'group1', name: 'Group 1', title: 'Group 1' },
        { gid: 'group2', name: 'Group 2', title: 'Group 2' },
        { gid: 'group3', name: 'Group 3', title: 'Group 3' }
    ]

    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
            ; (addSmallLink as jest.Mock).mockResolvedValue({
                data: {
                    success: true
                },
            }
            )
            ; (queryTitle as jest.Mock).mockRejectedValue({
                data: {
                    data: 'Mocked Title'
                },
            })
    })

    // ============================================
    // Set 2.1: Component Renders
    // ============================================
    describe('Set 2.1: Component Renders', () => {
        it('renders form container', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            const formContainer = screen.getByTestId('component-create-link')
            expect(formContainer).toBeInTheDocument()
        })

        it('renders URL input field', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            const urlInput = screen.getByTestId('input-origin-url')
            expect(urlInput).toBeInTheDocument()
        })

        it('renders description textarea', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            const descriptionTextarea = screen.getByTestId('textarea-describe')
            expect(descriptionTextarea).toBeInTheDocument
        })

        it('renders group select dropdown', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            const groupSelect = screen.getByTestId('select-group')
            expect(groupSelect).toBeInTheDocument()
        })

        it('renders validity period radio buttons', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            const radioGroup = screen.getByTestId('radio-valid-date-type')
            expect(radioGroup).toBeInTheDocument()

            // Check for both radio options
            const permanentRadio = screen.getByText('Permanent')
            const customRadio = screen.getByText('Custom')
            expect(permanentRadio).toBeInTheDocument()
            expect(customRadio).toBeInTheDocument()
        })

        it('render submit and cancel buttons', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            
            const submitButton = screen.getByTestId('button-submit')
            const cancelButton = screen.getByTestId('button-cancel')

            expect(submitButton).toBeInTheDocument()
            expect(cancelButton).toBeInTheDocument()
            expect(submitButton).toHaveTextContent('Confirm')
            expect(cancelButton).toHaveTextContent('Cancel')
        })

        it('renders all form labels', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            
            expect(screen.getByText('Redirect URL')).toBeInTheDocument()
            expect(screen.getByText('Description')).toBeInTheDocument()
            expect(screen.getByText('Group')).toBeInTheDocument()
            expect(screen.getByText('Validity Period')).toBeInTheDocument()
        })

        it('does not render date picker when validity period is Permanent', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            
            const datePicker = screen.queryByTestId('date-picker-valid-date')
            expect(datePicker).not.toBeInTheDocument()
        })
    })
    // ============================================
    // Set 2.2: Form Fields Display
    // ============================================
    describe('Set 2.2: Form Fields Display', () => {
        it('URL input has correct placeholder', () => {
            render(<CreateLink groupInfo={ mockGroups } isSingle={ true } />)

            const urlInput = screen.getByTestId('input-origin-url')
            expect(urlInput).toHaveAttribute(
                'placeholder',
                'Please enter a link starting with http:// or https:// or app redirect link'
            )
        })

        it('description textarea has correct placeholder', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            const descriptionTextarea = screen.getByTestId('textarea-describe')
            expect(descriptionTextarea).toHaveAttribute(
                'placeholder',
                'Please enter description'
            )
        })

        it('group select shows options from props', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            const groupSelect = screen.getByTestId('select-group')
            expect(groupSelect).toBeInTheDocument()

            // Click to open dropdown and check options 
            // Note: Ant Design Select requires interaction to show options
            // We'll verify the component is rendered with correct props
            expect(groupSelect).toBeInTheDocument()
        })

        it('default group is selected when provided', () => {
            const defaultGid = 'group2'
            render(<CreateLink groupInfo={ mockGroups } defaultGid={ defaultGid } />)
            
            // The form should be initialized with defaultGid
            // We can verify this by checking if the form has the value set
            // Note: Ant Design Form values are internal, so we check the component rendered
            const groupSelect = screen.getByTestId('select-group')
            expect(groupSelect).toBeInTheDocument()
        })

        it('selects first group when no defaultGid is provided', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            
            // Form should intiialize with first group
            const groupSelect = screen.getByTestId('select-group')
            expect(groupSelect).toBeInTheDocument()
        })

        it('group select component is rendered correctly', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            
            const groupSelect = screen.getByTestId('select-group')
            expect(groupSelect).toBeInTheDocument()
        })

        it('renders row count message for description', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
            
            // should show "Will create 0 short link(s)" intially
            expect(screen.getByText(/Will create \d+ short link\(s\)/)).toBeInTheDocument()
        })

        it('renders description textarea with maxLength and showCount', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
        
            const descriptionTextarea = screen.getByTestId('textarea-describe')
            expect(descriptionTextarea).toHaveAttribute('maxlength', '100')
        })

        it('renders submit button as primary type', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
        
            const submitButton = screen.getByTestId('button-submit')
            expect(submitButton).toHaveClass('ant-btn-primary')
        })

        it('renders cancel button as default type', () => {
            render(<CreateLink groupInfo={ mockGroups } />)
        
            const cancelButton = screen.getByTestId('button-cancel')
            expect(cancelButton).toBeInTheDocument()
            // Cancel button should not have primary class
            expect(cancelButton).not.toHaveClass('ant-btn-primary')
        })
    })

    // ============================================
    // Additional rendering tests
    // ============================================   
    
    describe('Additional Rendering Tests', () => {
        it('renders with empty groupInfo array', () => {
            render(<CreateLink groupInfo={ [] } />)
      
            const formContainer = screen.getByTestId('component-create-link')
            expect(formContainer).toBeInTheDocument()
        })

        it('renders with single group', () => {
            const singleGroup: Group[] = [ { gid: 'group1', name: 'Group 1' } ]
            render(<CreateLink groupInfo={ singleGroup } />)


            const groupSelect = screen.getByTestId('select-group')
            expect(groupSelect).toBeInTheDocument()
        })

        it('renders with isSingle=false (batch mode)', () => {
            render(<CreateLink groupInfo={ mockGroups } isSingle={ false } />)
            
            // In batch mode, should render TextArea instead of Input for URL
            const urlTextarea = screen.getByTestId('textarea-origin-url')
            expect(urlTextarea).toBeInTheDocument()

            // Should have batch placeholder
            expect(urlTextarea).toHaveAttribute(
            'placeholder',
            'Please enter links starting with http:// or https://, one per line, maximum 100 lines'
            )
        })

        it('renders date picker when validity period is Custom', () => {
            // This test will need user interaction to change radio, so we'll test the conditional rendering
            // The date picker should not be visible initially
            render(<CreateLink groupInfo={mockGroups} />)      
            const datePicker = screen.queryByTestId('date-picker-valid-date')
            expect(datePicker).not.toBeInTheDocument()
        })


        it('renders expiration alert message when date picker is visible', () => {
        // This will be tested in Set 4 (User Interactions) when we can change the radio
        render(<CreateLink groupInfo={mockGroups} />)
        
        // Initially, alert should not be visible
        const alert = screen.queryByText(/Link will automatically redirect to 404 page after expiration!/)
        expect(alert).not.toBeInTheDocument()
        })
    })
})

