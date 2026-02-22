/// <reference types="jest" />
import { render, screen } from '@testing-library/react'
import TitleContent from './TitleContent'

describe('TitleContent Component', () => {
  it('renders title', () => {
    render(
      <TitleContent title="Test Title">
        <div>Content</div>
      </TitleContent>
    )
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
  })

  it('renders children content', () => {
    render(
      <TitleContent title="Test Title">
        <div data-testid="content">Content</div>
      </TitleContent>
    )
    
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('renders title button when provided', () => {
    render(
      <TitleContent 
        title="Test Title"
        titleButton={<button data-testid="title-button">Button</button>}
      >
        <div>Content</div>
      </TitleContent>
    )
    
    expect(screen.getByTestId('title-button')).toBeInTheDocument()
  })

  it('does not render title button when not provided', () => {
    render(
      <TitleContent title="Test Title">
        <div>Content</div>
      </TitleContent>
    )
    
    expect(screen.queryByTestId('title-button')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <TitleContent title="Test Title" className="custom-class">
        <div>Content</div>
      </TitleContent>
    )
    
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv.className).toContain('custom-class')
  })

  it('applies custom style prop', () => {
    const customStyle = { padding: '20px', margin: '10px' }
    const { container } = render(
      <TitleContent title="Test Title" style={customStyle}>
        <div>Content</div>
      </TitleContent>
    )
    
    const mainDiv = container.firstChild as HTMLElement
    expect(mainDiv).toHaveStyle('padding: 20px')
    expect(mainDiv).toHaveStyle('margin: 10px')
  })

  it('calls onMounted callback when provided', () => {
    const onMounted = jest.fn()
    
    render(
      <TitleContent title="Test Title" onMounted={onMounted}>
        <div>Content</div>
      </TitleContent>
    )
    
    expect(onMounted).toHaveBeenCalledTimes(1)
  })

  it('does not call onMounted when not provided', () => {
    const onMounted = jest.fn()
    
    render(
      <TitleContent title="Test Title">
        <div>Content</div>
      </TitleContent>
    )
    
    expect(onMounted).not.toHaveBeenCalled()
  })

  it('renders complex children content', () => {
    render(
      <TitleContent title="Test Title">
        <div>
          <span>Item 1</span>
          <span>Item 2</span>
        </div>
      </TitleContent>
    )
    
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('renders multiple children', () => {
    render(
      <TitleContent title="Test Title">
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </TitleContent>
    )
    
    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
  })
})
