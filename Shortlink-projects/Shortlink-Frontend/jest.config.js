const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/src/(.*)$': '<rootDir>/src/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
  },
  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)', // Only match test files in __tests__
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/helpers/', // Ignore helper directories
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/*.config.{js,ts}',
  ],
  // Coverage thresholds - set to 0% initially, increase as test suite grows
  // TODO: Gradually increase thresholds as more tests are added
  // Target: branches: 70, functions: 70, lines: 70, statements: 70
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  // HTML Coverage Report Configuration
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  // Optional: Add jest-html-reporters for beautiful test reports
  // Install: npm install --save-dev jest-html-reporters
  // Uncomment the following after installation:
  /*
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './jest-html-report',
        filename: 'report.html',
        expand: true,
        openReport: false,
        hideIcon: false,
        pageTitle: 'Jest Test Report',
        logoImgPath: undefined,
        inlineSource: false,
      },
    ],
  ],
  */
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
