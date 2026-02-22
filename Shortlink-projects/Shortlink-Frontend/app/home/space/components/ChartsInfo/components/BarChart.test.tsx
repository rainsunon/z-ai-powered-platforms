/// <reference types="jest" />
import { render, screen } from '@testing-library/react'
import BarChart from './BarChart'

// Mock Recharts components
jest.mock('recharts', () => ({
  BarChart: ({ children, data }: any) => (
    <div data-testid="recharts-bar-chart" data-items={data?.length || 0}>
      {children}
    </div>
  ),
  Bar: () => <div data-testid="recharts-bar" />,
  XAxis: () => <div data-testid="recharts-x-axis" />,
  YAxis: () => <div data-testid="recharts-y-axis" />,
  Tooltip: () => <div data-testid="recharts-tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  CartesianGrid: () => <div data-testid="recharts-cartesian-grid" />,
}))

describe('BarChart Component', () => {
  const mockChartData = {
    xAxis: ['Jan', 'Feb', 'Mar', 'Apr'],
    value: [100, 200, 150, 300],
  }

  it('renders chart container', () => {
    render(<BarChart chartData={mockChartData} />)
    
    const container = screen.getByTestId('responsive-container')
    expect(container).toBeInTheDocument()
  })

  it('renders Recharts BarChart component', () => {
    render(<BarChart chartData={mockChartData} />)
    
    const barChart = screen.getByTestId('recharts-bar-chart')
    expect(barChart).toBeInTheDocument()
  })

  it('transforms data correctly', () => {
    render(<BarChart chartData={mockChartData} />)
    
    const barChart = screen.getByTestId('recharts-bar-chart')
    expect(barChart).toHaveAttribute('data-items', '4')
  })

  it('renders all chart elements', () => {
    render(<BarChart chartData={mockChartData} />)
    
    expect(screen.getByTestId('recharts-cartesian-grid')).toBeInTheDocument()
    expect(screen.getByTestId('recharts-x-axis')).toBeInTheDocument()
    expect(screen.getByTestId('recharts-y-axis')).toBeInTheDocument()
    expect(screen.getByTestId('recharts-tooltip')).toBeInTheDocument()
    expect(screen.getByTestId('recharts-bar')).toBeInTheDocument()
  })

  it('handles empty data', () => {
    const emptyData = {
      xAxis: [],
      value: [],
    }
    
    render(<BarChart chartData={emptyData} />)
    
    const barChart = screen.getByTestId('recharts-bar-chart')
    expect(barChart).toHaveAttribute('data-items', '0')
  })

  it('handles mismatched array lengths', () => {
    const mismatchedData = {
      xAxis: ['Jan', 'Feb'],
      value: [100, 200, 300], // More values than xAxis
    }
    
    render(<BarChart chartData={mismatchedData} />)
    
    const barChart = screen.getByTestId('recharts-bar-chart')
    expect(barChart).toBeInTheDocument()
  })

  it('handles numeric xAxis values', () => {
    const numericData = {
      xAxis: [1, 2, 3],
      value: [10, 20, 30],
    }
    
    render(<BarChart chartData={numericData} />)
    
    const barChart = screen.getByTestId('recharts-bar-chart')
    expect(barChart).toHaveAttribute('data-items', '3')
  })
})
