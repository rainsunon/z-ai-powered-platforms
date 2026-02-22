import { test, expect } from '@playwright/test'

/**
 * Visual Regression Tests for CreateLink Component
 * 
 * Simplified tests to verify Storybook integration works correctly.
 * Focus: Capture screenshots to verify components render properly.
 */

test.describe('CreateLink Component Visual Regression', () => {
  test.setTimeout(60000)

  test('should capture default state screenshot', async ({ page }) => {
    // Navigate directly to the story iframe
    await page.goto('/iframe.html?id=components-createlink--default')
    
    // Wait for page to load and component to render
    // Simple wait - just enough for Storybook to load the story
    await page.waitForTimeout(5000)
    
    // Take screenshot - this will be saved for visual verification
    // We're not comparing yet, just capturing to verify the flow works
    await page.screenshot({ 
      path: 'test-results/create-link-default.png',
      fullPage: true 
    })
  })

  test('should capture with default group selected screenshot', async ({ page }) => {
    await page.goto('/iframe.html?id=components-createlink--with-default-group')
    
    // Wait for component to render
    await page.waitForTimeout(5000)
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/create-link-with-default-group.png',
      fullPage: true 
    })
  })

  test('should capture empty groups screenshot', async ({ page }) => {
    await page.goto('/iframe.html?id=components-createlink--empty-groups')
    
    // Wait for component to render
    await page.waitForTimeout(5000)
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/create-link-empty-groups.png',
      fullPage: true 
    })
  })
})
