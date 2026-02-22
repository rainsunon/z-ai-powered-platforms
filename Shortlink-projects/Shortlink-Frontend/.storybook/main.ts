import type { StorybookConfig } from '@storybook/nextjs'
import path from 'path'

const config: StorybookConfig = {
  stories: [
    '../app/**/*.stories.@(js|jsx|ts|tsx)',
    '../app/**/*.mdx',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: path.resolve(__dirname, '../next.config.mjs'),
    },
  },
  staticDirs: ['../public'],
  // Enable buildStoriesJson for static builds to ensure stories are properly indexed
  // This is critical for iframe.html to work correctly in static builds
  features: {
    buildStoriesJson: true, // Enable stories.json generation for static builds
    storyStoreV7: true, // Use Storybook 7's new story store
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  // Configure webpack to handle CSS modules and path aliases
  webpackFinal: async (config) => {
    // Handle path aliases (same as Next.js tsconfig.json)
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '..'),
        '@/src': path.resolve(__dirname, '../src'),
        '@/app': path.resolve(__dirname, '../app'),
      }
    }

    // CSS Modules support is already handled by @storybook/nextjs
    // But we ensure CSS files are processed correctly
    const rules = config.module?.rules || []
    const cssRule = rules.find((rule: any) => 
      rule.test && rule.test.toString().includes('css')
    )

    return config
  },
}

export default config
