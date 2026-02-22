import type { Preview } from '@storybook/react'
import React from 'react'
import { ConfigProvider } from 'antd'
import '../app/globals.css' // Import global CSS (includes Tailwind)

/**
 * Storybook Preview Configuration
 * 
 * This file configures how stories are rendered in Storybook.
 * It imports global styles and sets up decorators for all stories.
 */

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1f1f1f',
        },
      ],
    },
    // Next.js specific parameters
    nextjs: {
      appDirectory: true,
    },
    // Ensure stories load correctly in static builds
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ConfigProvider>
        <div style={{ padding: '20px', minHeight: '100vh' }}>
          <Story />
        </div>
      </ConfigProvider>
    ),
  ],
}

export default preview
