/// <reference types="jest" />
import { render, screen } from '@testing-library/react'
import LineChart from './LineChart'

// Mock Recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children, data }: any) => (
    <div data-testid="recharts-line-chart" data-items={data?.length || 0}>
      {children}
    </div>
  ),
  Line: ({ name }: any) => <div data-testid={`recharts-line-${name}`} />,
  XAxis: () => <div data-testid="recharts-x-axis" />,
  YAxis: () => <div data-testid="recharts-y-axis" />,
  Tooltip: () => <div data-testid="recharts-tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  CartesianGrid: () => <div data-testid="recharts-cartesian-grid" />,
  Legend: () => <div data-testid="recharts-legend" />,
}))

describe('LineChart Component', () => {
  const mockData = [
    { date: '2024-01-01', pv: 100, uv: 50, uip: 30 },
    { date: '2024-01-02', pv: 150, uv: 75, uip: 40 },
    { date: '2024-01-03', pv: 200, uv: 100, uip: 50 },
  ]

  it('renders chart container', () => {
    render(<LineChart data={mockData} />)
    
    const container = screen.getByTestId('responsive-container')
    expect(container).toBeInTheDocument()
  })

  it('renders Recharts LineChart component', () => {
    render(<LineChart data={mockData} />)
    
    const lineChart = screen.getByTestId('recharts-line-chart')
    expect(lineChart).toBeInTheDocument()
  })

  it('displays correct number of data points', () => {
    render(<LineChart data={mockData} />)
    
    const lineChart = screen.getByTestId('recharts-line-chart')
    expect(lineChart).toHaveAttribute('data-items', '3')
  })

  it('renders all chart elements', () => {
    render(<LineChart data={mockData} />)
    
    expect(screen.getByTestId('recharts-cartesian-grid')).toBeInTheDocument()
    expect(screen.getByTestId('recharts-x-axis')).toBeInTheDocument()
    expect(screen.getByTestId('recharts-y-axis')).toBeInTheDocument()
    expect(screen.getByTestId('recharts-tooltip')).toBeInTheDocument()
    expect(screen.getByTestId('recharts-legend')).toBeInTheDocument()
  })

  it('renders all three line series', () => {
    render(<LineChart data={mockData} />)
    
    // LineChart uses English names: "Page Views", "Unique Visitors", "Unique IPs"
    expect(screen.getByTestId('recharts-line-Page Views')).toBeInTheDocument()
    expect(screen.getByTestId('recharts-line-Unique Visitors')).toBeInTheDocument()
    expect(screen.getByTestId('recharts-line-Unique IPs')).toBeInTheDocument()
  })

  it('handles empty data array', () => {
    render(<LineChart data={[]} />)
    
    const lineChart = screen.getByTestId('recharts-line-chart')
    expect(lineChart).toHaveAttribute('data-items', '0')
  })

  it('applies custom style prop', () => {
    const customStyle = { padding: '20px' }
    const { container } = render(<LineChart data={mockData} style={customStyle} />)
    
    const chartDiv = container.firstChild as HTMLElement
    expect(chartDiv).toHaveStyle('padding: 20px')
  })

  it('handles data with missing fields', () => {
    // Provide all required fields, but some with zero values to simulate missing data
    const incompleteData = [
      { date: '2024-01-01', pv: 100, uv: 0, uip: 0 },
      { date: '2024-01-02', pv: 0, uv: 75, uip: 0 },
    ]
    
    render(<LineChart data={incompleteData} />)
    
    const lineChart = screen.getByTestId('recharts-line-chart')
    expect(lineChart).toBeInTheDocument()
  })
})
