/// <reference types="jest" />
import { render, screen } from '@testing-library/react'
import ProgressLine from './ProgressLine'

// Mock Ant Design Progress
jest.mock('antd', () => {
  const antd = jest.requireActual('antd')
  return {
    ...antd,
    Progress: ({ percent }: any) => (
      <div data-testid="ant-progress" data-percent={percent} />
    ),
  }
})

describe('ProgressLine Component', () => {
  const mockDataLists = [
    { os: 'Windows', cnt: 100, ratio: 0.5 },
    { browser: 'Chrome', cnt: 80, ratio: 0.4 },
    { name: 'Linux', cnt: 20, ratio: 0.1 },
  ]

  it('renders progress items for each data entry', () => {
    render(<ProgressLine dataLists={mockDataLists} />)
    
    const progressBars = screen.getAllByTestId('ant-progress')
    expect(progressBars).toHaveLength(3)
  })

  it('displays empty state when dataLists is empty', () => {
    render(<ProgressLine dataLists={[]} />)
    
    expect(screen.getByText('No access data for selected date range')).toBeInTheDocument()
  })

  it('displays empty state when dataLists is undefined', () => {
    render(<ProgressLine />)
    
    expect(screen.getByText('No access data for selected date range')).toBeInTheDocument()
  })

  it('displays OS name when os field exists', () => {
    render(<ProgressLine dataLists={[{ os: 'Windows', cnt: 100, ratio: 0.5 }]} />)
    
    expect(screen.getByText(/Windows/)).toBeInTheDocument()
  })

  it('displays browser name when browser field exists', () => {
    render(<ProgressLine dataLists={[{ browser: 'Chrome', cnt: 80, ratio: 0.4 }]} />)
    
    expect(screen.getByText(/Chrome/)).toBeInTheDocument()
  })

  it('displays name when name field exists', () => {
    render(<ProgressLine dataLists={[{ name: 'Linux', cnt: 20, ratio: 0.1 }]} />)
    
    expect(screen.getByText(/Linux/)).toBeInTheDocument()
  })

  it('displays count with correct format', () => {
    render(<ProgressLine dataLists={[{ os: 'Windows', cnt: 100, ratio: 0.5 }]} />)
    
    expect(screen.getByText('100 visits')).toBeInTheDocument()
  })

  it('calculates and displays percentage correctly', () => {
    render(<ProgressLine dataLists={[{ os: 'Windows', ratio: 0.5 }]} />)
    
    expect(screen.getByText(/50.00%/)).toBeInTheDocument()
  })

  it('renders progress bar with correct percent', () => {
    render(<ProgressLine dataLists={[{ os: 'Windows', ratio: 0.75 }]} />)
    
    const progressBar = screen.getByTestId('ant-progress')
    expect(progressBar).toHaveAttribute('data-percent', '75')
  })

  it('handles missing cnt field (defaults to 0)', () => {
    render(<ProgressLine dataLists={[{ os: 'Windows', ratio: 0.5 }]} />)
    
    expect(screen.getByText('0 visits')).toBeInTheDocument()
  })

  it('handles missing ratio field (defaults to 0)', () => {
    render(<ProgressLine dataLists={[{ os: 'Windows', cnt: 100 }]} />)
    
    const progressBar = screen.getByTestId('ant-progress')
    expect(progressBar).toHaveAttribute('data-percent', '0')
  })

  it('applies custom style prop', () => {
    const customStyle = { padding: '30px' }
    const { container } = render(<ProgressLine dataLists={mockDataLists} style={customStyle} />)
    
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveStyle('padding: 30px')
  })

  it('uses fallback name when os, browser, and name are all missing', () => {
    render(<ProgressLine dataLists={[{ cnt: 50, ratio: 0.25 }]} />)
    
    expect(screen.getByText(/Item 1/)).toBeInTheDocument()
  })
})
