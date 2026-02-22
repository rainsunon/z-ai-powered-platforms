/// <reference types="jest" />
import { render, screen } from '@testing-library/react'
import ProgressPie from './ProgressPie'

// Mock Ant Design Progress
jest.mock('antd', () => {
  const antd = jest.requireActual('antd')
  return {
    ...antd,
    Progress: ({ percent, format }: any) => (
      <div data-testid="ant-progress" data-percent={percent}>
        {format && format()}
      </div>
    ),
  }
})

describe('ProgressPie Component', () => {
  it('renders two progress circles', () => {
    const labels = ['New Visitors', 'Returning Visitors']
    const data = [60, 40]
    
    render(<ProgressPie labels={labels} data={data} />)
    
    const progressCircles = screen.getAllByTestId('ant-progress')
    expect(progressCircles).toHaveLength(2)
  })

  it('calculates percentages correctly', () => {
    const labels = ['New Visitors', 'Returning Visitors']
    const data = [60, 40] // 60 + 40 = 100
    
    render(<ProgressPie labels={labels} data={data} />)
    
    const progressCircles = screen.getAllByTestId('ant-progress')
    expect(progressCircles[0]).toHaveAttribute('data-percent', '60')
    expect(progressCircles[1]).toHaveAttribute('data-percent', '40')
  })

  it('displays labels correctly', () => {
    const labels = ['New Visitors', 'Returning Visitors']
    const data = [60, 40]
    
    render(<ProgressPie labels={labels} data={data} />)
    
    expect(screen.getByText(/New Visitors/)).toBeInTheDocument()
    expect(screen.getByText(/Returning Visitors/)).toBeInTheDocument()
  })

  it('displays data values with correct units', () => {
    const labels = ['New Visitors', 'Returning Visitors']
    const data = [60, 40]
    
    render(<ProgressPie labels={labels} data={data} />)
    
    // New Visitors uses 'visitors', Returning Visitors uses 'visitors'
    expect(screen.getByText(/60 visitors/)).toBeInTheDocument()
    expect(screen.getByText(/40 visitors/)).toBeInTheDocument()
  })

  it('handles zero values', () => {
    const labels = ['New Visitors', 'Returning Visitors']
    const data = [0, 0]
    
    render(<ProgressPie labels={labels} data={data} />)
    
    const progressCircles = screen.getAllByTestId('ant-progress')
    expect(progressCircles[0]).toHaveAttribute('data-percent', '0')
    expect(progressCircles[1]).toHaveAttribute('data-percent', '0')
  })

  it('handles empty data array', () => {
    const labels = ['Data 1', 'Data 2']
    const data: number[] = []
    
    render(<ProgressPie labels={labels} data={data} />)
    
    const progressCircles = screen.getAllByTestId('ant-progress')
    expect(progressCircles[0]).toHaveAttribute('data-percent', '0')
    expect(progressCircles[1]).toHaveAttribute('data-percent', '0')
  })

  it('handles missing labels', () => {
    const labels: string[] = []
    const data = [60, 40]
    
    render(<ProgressPie labels={labels} data={data} />)
    
    expect(screen.getByText(/Data 1/)).toBeInTheDocument()
    expect(screen.getByText(/Data 2/)).toBeInTheDocument()
  })

  it('applies custom style prop', () => {
    const labels = ['New Visitors', 'Returning Visitors']
    const data = [60, 40]
    const customStyle = { margin: '20px' }
    
    const { container } = render(<ProgressPie labels={labels} data={data} style={customStyle} />)
    
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveStyle('margin: 20px')
  })

  it('calculates percentage correctly for uneven values', () => {
    const labels = ['New Visitors', 'Returning Visitors']
    const data = [30, 70] // 30 + 70 = 100
    
    render(<ProgressPie labels={labels} data={data} />)
    
    const progressCircles = screen.getAllByTestId('ant-progress')
    expect(progressCircles[0]).toHaveAttribute('data-percent', '30')
    expect(progressCircles[1]).toHaveAttribute('data-percent', '70')
  })
})
