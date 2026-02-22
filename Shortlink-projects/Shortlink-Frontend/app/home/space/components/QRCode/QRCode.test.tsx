/// <reference types="jest" />
import { render, screen, fireEvent } from '@testing-library/react'
import QRCode from './QRCode'

// Mock qrcode.react
jest.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value, size }: { value: string; size: number }) => (
    <div data-testid="qrcode-svg" data-value={value} data-size={size}>
      QR Code: {value}
    </div>
  ),
}))

describe('QRCode Component', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('renders QR code modal when visible is true', () => {
    render(
      <QRCode 
        url="https://example.com"
        visible={true}
        onClose={mockOnClose}
      />
    )
    
    expect(screen.getByText('QR Code')).toBeInTheDocument()
    expect(screen.getByTestId('qrcode-svg')).toBeInTheDocument()
    expect(screen.getByText('https://example.com')).toBeInTheDocument()
  })

  it('does not render when visible is false', () => {
    render(
      <QRCode 
        url="https://example.com"
        visible={false}
        onClose={mockOnClose}
      />
    )
    
    expect(screen.queryByText('QR Code')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(
      <QRCode 
        url="https://example.com"
        visible={true}
        onClose={mockOnClose}
      />
    )
    
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('displays the correct URL', () => {
    const testUrl = 'https://test.example.com'
    render(
      <QRCode 
        url={testUrl}
        visible={true}
        onClose={mockOnClose}
      />
    )
    
    expect(screen.getByText(testUrl)).toBeInTheDocument()
    const qrCode = screen.getByTestId('qrcode-svg')
    expect(qrCode).toHaveAttribute('data-value', testUrl)
  })

  it('renders download button', () => {
    render(
      <QRCode 
        url="https://example.com"
        visible={true}
        onClose={mockOnClose}
      />
    )
    
    expect(screen.getByText('Download')).toBeInTheDocument()
  })
})
