// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Setup MSW server for API mocking (only if MSW is installed and available)
let server
try {
  // Try to require MSW - Jest will transpile TypeScript files automatically
  // If MSW is not available, tests will continue without API mocking
  const mswModule = require('./mocks/server')
  
  if (mswModule && mswModule.server) {
    server = mswModule.server
    
    // Establish API mocking before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
    
    // Reset any request handlers that we may add during the tests,
    // so they don't affect other tests
    afterEach(() => server.resetHandlers())
    
    // Clean up after the tests are finished
    afterAll(() => server.close())
  }
} catch (error) {
  // MSW not available - silently continue
  // Tests that need MSW will handle their own MSW setup if needed
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Suppress known warnings in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    // Suppress Ant Design Form.Item warnings (known issue in tests)
    if (
      typeof args[0] === 'string' &&
      args[0].includes('[antd: Form.Item]')
    ) {
      return
    }
    // Suppress React SVG warnings (Recharts uses SVG elements)
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('The tag <stop> is unrecognized') ||
       args[0].includes('is using incorrect casing'))
    ) {
      return
    }
    // Log other errors normally
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
