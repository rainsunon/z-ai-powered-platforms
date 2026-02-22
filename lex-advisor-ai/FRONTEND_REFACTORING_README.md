# Frontend Refactoring - shadcn/ui, Feature-Based Architecture & Performance

This document describes the frontend refactoring work completed for the LexAI project, including shadcn/ui integration, feature-based architecture, component extraction, and lazy-loading implementation.

## Overview

The frontend has been refactored with:
- **shadcn/ui Components**: Modern, accessible UI component library
- **Feature-Based Architecture**: Organized code by feature modules
- **Component Extraction**: Large components broken into smaller, reusable pieces
- **Lazy Loading**: Code splitting for improved performance

## New Project Structure

```
lexai-frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── features/              # Feature-based modules
│   │   └── document-analysis/
│   │       └── components/
│   │           ├── DocumentUpload.tsx
│   │           └── AnalysisResults.tsx
│   ├── pages/                # Page components
│   ├── lib/
│   │   └── utils.ts        # Utility functions
│   └── ...
├── components.json             # shadcn/ui configuration
├── tailwind.config.js         # Updated with shadcn/ui theme
├── tsconfig.json             # Path aliases configured
└── vite.config.js            # Vite aliases configured
```

## shadcn/ui Setup

### Configuration Files

#### `components.json`
Configuration file for shadcn/ui component management:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide-react"
}
```

### Tailwind Configuration

Updated [`tailwind.config.js`](lexai-frontend/tailwind.config.js) with:
- Dark mode support
- shadcn/ui color system with CSS variables
- Custom border radius
- Animation keyframes for accordion
- Container utilities

### CSS Variables

Updated [`index.css`](lexai-frontend/src/index.css) with:
- Root color variables for light mode
- Dark mode color variables
- Semantic color tokens (primary, secondary, destructive, etc.)
- Border and input colors
- Animation keyframes

### Utility Functions

Created [`lib/utils.ts`](lexai-frontend/src/lib/utils.ts) with `cn()` helper:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## shadcn/ui Components

### Button Component

[`components/ui/button.tsx`](lexai-frontend/src/components/ui/button.tsx)
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon
- Uses class-variance-authority for variant management
- Supports asChild prop for composition with Radix UI Slot

### Card Component

[`components/ui/card.tsx`](lexai-frontend/src/components/ui/card.tsx)
- Sub-components: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Consistent styling with CSS variables
- Composable structure

## Feature-Based Architecture

### Document Analysis Feature

Created feature module at [`features/document-analysis/`](lexai-frontend/src/features/document-analysis/):

#### DocumentUpload Component

[`features/document-analysis/components/DocumentUpload.tsx`](lexai-frontend/src/features/document-analysis/components/DocumentUpload.tsx)
- File upload with drag and drop support
- Progress indicator during upload
- File preview with remove option
- Integration with shadcn/ui Button and Card components

Props:
- `file`: Currently selected file
- `onFileChange`: Callback for file selection changes
- `onUpload`: Upload handler
- `uploading`: Upload state
- `uploadProgress`: Upload progress percentage

#### AnalysisResults Component

[`features/document-analysis/components/AnalysisResults.tsx`](lexai-frontend/src/features/document-analysis/components/AnalysisResults.tsx)
- Displays AI analysis results
- Color-coded sections for different information types
- Confidence score display
- Key points, legal areas, and summary display

Props:
- `analysis`: Analysis results object containing:
  - documentType
  - summary
  - keyPoints
  - legalAreas
  - jurisdiction
  - confidenceScore

## Lazy Loading Implementation

Updated [`App.jsx`](lexai-frontend/src/App.jsx) with:
- React.lazy() for all page imports
- Suspense wrapper with PageLoader fallback
- Code splitting by route
- Improved initial load time

### Benefits:
- Reduced initial bundle size
- Faster page load times
- Better perceived performance
- Code splitting by feature

### Loading Component

Added `PageLoader` component:
```jsx
const PageLoader = () => (
  <div className="h-screen flex items-center justify-center bg-white text-blue-600">
    <Loader2 className="animate-spin" size={48} />
  </div>
);
```

## Path Aliases

### Vite Configuration

Updated [`vite.config.js`](lexai-frontend/vite.config.js):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### TypeScript Configuration

Created [`tsconfig.json`](lexai-frontend/tsconfig.json):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Dependencies Added

### Radix UI Primitives
- `@radix-ui/react-accordion`
- `@radix-ui/react-alert-dialog`
- `@radix-ui/react-avatar`
- `@radix-ui/react-checkbox`
- `@radix-ui/react-dialog`
- `@radix-ui/react-dropdown-menu`
- `@radix-ui/react-label`
- `@radix-ui/react-select`
- `@radix-ui/react-separator`
- `@radix-ui/react-slot`
- `@radix-ui/react-tabs`
- `@radix-ui/react-toast`

### Utility Libraries
- `class-variance-authority`: For component variant management
- `tailwindcss-animate`: For Tailwind animations

## Usage Examples

### Using shadcn/ui Button

```jsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">
  Click Me
</Button>

<Button variant="outline" size="sm">
  Cancel
</Button>
```

### Using shadcn/ui Card

```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Using Feature Components

```jsx
import { DocumentUpload } from '@/features/document-analysis/components/DocumentUpload';
import { AnalysisResults } from '@/features/document-analysis/components/AnalysisResults';

<DocumentUpload
  file={selectedFile}
  onFileChange={setFile}
  onUpload={handleUpload}
  uploading={isUploading}
  uploadProgress={progress}
/>

<AnalysisResults
  analysis={analysisData}
/>
```

### Using cn() Utility

```jsx
import { cn } from '@/lib/utils';

<div className={cn("base-class", "conditional-class")}>
  Content
</div>
```

## Performance Improvements

### Code Splitting
- Each page is lazy-loaded
- Reduces initial bundle size
- Loads code on-demand

### Component Reusability
- Smaller, focused components
- Easier to maintain and test
- Consistent styling via shadcn/ui

### Path Resolution
- Clean import paths with @ alias
- Better developer experience
- Easier refactoring

## Next Steps

### Adding More shadcn/ui Components

To add more shadcn/ui components:
```bash
npx shadcn@latest add [component-name]
```

Available components:
- Input
- Select
- Checkbox
- Dialog
- Alert Dialog
- Tabs
- Accordion
- Avatar
- Toast
- Dropdown Menu
- Separator
- And many more...

### Refactoring Other Pages

Apply the same pattern to other pages:
1. Extract large components into smaller pieces
2. Use shadcn/ui components where appropriate
3. Create feature-based folders for related functionality
4. Maintain consistent styling and patterns

### Performance Monitoring

Consider adding:
- React DevTools Profiler
- Web Vite Bundle Analyzer
- Lighthouse CI/CD integration
- Performance budgets

## TypeScript Notes

All new components are written in TypeScript with:
- Proper type definitions
- Interface exports for props
- Generic type support where needed
- Strict type checking enabled

## Browser Compatibility

shadcn/ui components use:
- Modern CSS features (CSS variables)
- Flexbox and Grid layouts
- CSS animations
- Accessible markup (ARIA attributes)

Supports:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Migration Notes

### From Old Components

When migrating existing components:
1. Replace inline styles with Tailwind classes
2. Use shadcn/ui Button for buttons
3. Use shadcn/ui Card for card layouts
4. Extract repeated patterns into reusable components
5. Update imports to use path aliases

### Breaking Changes

- Component imports now use `@/` prefix
- Some components now require different props
- Styling may need adjustment for shadcn/ui theme

## Troubleshooting

### Import Errors

If you see import errors:
```bash
# Restart dev server
npm run dev

# Clear cache
rm -rf node_modules/.vite
```

### Path Alias Issues

If `@/` imports don't work:
1. Check `vite.config.js` has correct alias configuration
2. Check `tsconfig.json` has correct paths configuration
3. Restart TypeScript server (VS Code: Cmd+Shift+P)

### Styling Issues

If shadcn/ui components don't style correctly:
1. Verify `tailwind.config.js` includes shadcn/ui theme
2. Check `index.css` has CSS variables
3. Ensure Tailwind CSS is processing correctly

## Best Practices

### Component Design
- Keep components small and focused
- Use composition over inheritance
- Provide clear prop interfaces
- Use TypeScript for type safety

### Performance
- Lazy load routes
- Avoid unnecessary re-renders
- Use React.memo for expensive components
- Optimize images and assets

### Code Organization
- Group related files by feature
- Use clear naming conventions
- Keep component files focused
- Separate concerns (UI, logic, data)

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

## License

This refactoring is part of the LexAI project.
