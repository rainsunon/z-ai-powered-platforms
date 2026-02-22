/// <reference types="jest" />
import { render, screen } from '@testing-library/react'
import KeyValue from './KeyValue'

describe('KeyValue Component', () => {
  const mockDataLists = [
    { ip: '192.168.1.1', cnt: 100 },
    { name: 'Example', value: 50 },
    { ip: '10.0.0.1', cnt: 25 },
  ]

  it('renders key-value pairs for each data entry', () => {
    render(<KeyValue dataLists={mockDataLists} />)
    
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('Example')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('displays empty state when dataLists is empty', () => {
    render(<KeyValue dataLists={[]} />)
    
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('displays empty state when dataLists is undefined', () => {
    render(<KeyValue />)
    
    expect(screen.getByText('No data available')).toBeInTheDocument()
  })

  it('displays IP when ip field exists', () => {
    render(<KeyValue dataLists={[{ ip: '192.168.1.1', cnt: 100 }]} />)
    
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument()
  })

  it('displays name when name field exists', () => {
    render(<KeyValue dataLists={[{ name: 'Test Name', value: 50 }]} />)
    
    expect(screen.getByText('Test Name')).toBeInTheDocument()
  })

  it('displays cnt value when cnt field exists', () => {
    render(<KeyValue dataLists={[{ ip: '192.168.1.1', cnt: 100 }]} />)
    
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('displays value when value field exists', () => {
    render(<KeyValue dataLists={[{ name: 'Test', value: 50 }]} />)
    
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('defaults to 0 when cnt and value are missing', () => {
    render(<KeyValue dataLists={[{ ip: '192.168.1.1' }]} />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('uses fallback name when ip and name are missing', () => {
    render(<KeyValue dataLists={[{ cnt: 100 }]} />)
    
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })

  it('limits display to first 10 items', () => {
    const manyItems = Array.from({ length: 15 }, (_, i) => ({
      ip: `192.168.1.${i + 1}`,
      cnt: i + 1,
    }))
    
    render(<KeyValue dataLists={manyItems} />)
    
    // Should only show first 10
    expect(screen.getByText('192.168.1.1')).toBeInTheDocument()
    expect(screen.getByText('192.168.1.10')).toBeInTheDocument()
    expect(screen.queryByText('192.168.1.11')).not.toBeInTheDocument()
  })

  it('applies custom style prop', () => {
    const customStyle = { margin: '20px' }
    const { container } = render(<KeyValue dataLists={mockDataLists} style={customStyle} />)
    
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveStyle('margin: 20px')
  })

  it('renders borders between items except last one', () => {
    const { container } = render(<KeyValue dataLists={mockDataLists} />)
    
    const items = container.querySelectorAll('div[style*="border-bottom"]')
    // Should have borders for all but last item
    expect(items.length).toBeGreaterThan(0)
  })
})
