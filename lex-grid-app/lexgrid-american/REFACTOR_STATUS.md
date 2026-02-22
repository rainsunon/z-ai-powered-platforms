# Refactoring Plan

## DONE
1.  **Tailwind CSS Setup**: Installed and configured with `tailwind.config.js` and `postcss.config.js`. created `index.css` with Shadcn/Tailwind directives.
2.  **Architecture**: Created `src/features`, `src/components`, `src/lib`, `src/types` structure.
3.  **Shadcn UI**: Set up `lib/utils.ts` (cn) and `components/ui/button.tsx`.
4.  **Refactored Features**:
    -   `DivorceLaw`: Moved to `src/features/divorce-law`.
    -   `Billing`: Moved to `src/features/billing`.
5.  **Layout**: Moved logical layout to `src/components/layout/Layout.tsx` and kept root `components/Layout.tsx` as a re-export for backward compatibility.
6.  **App Routing**: Updated `App.tsx` to lazy load new feature pages.

## TODO (Next Steps)
1.  **Refactor Remaining Pages**:
    -   Move `Analysis.tsx` to `src/features/analysis/`.
    -   Move `AIChat.tsx` to `src/features/ai-chat/`.
    -   Move `Directory.tsx` to `src/features/directory/`.
    -   Move `Landing.tsx` to `src/features/landing/`.
    -   Move `Dashboard.tsx` to `src/features/dashboard/`.
    -   And so on.
2.  **Move Global Components**: Move any shared components from `components/` (root) to `src/components/` and update imports.
3.  **Adopt Shadcn Components**: Replace raw JSX elements (like buttons, inputs) with Shadcn components (install more if needed).
4.  **Cleanup**: Delete old `pages/` directory once all pages are migrated.

## How to Run
-   `npm run dev`
