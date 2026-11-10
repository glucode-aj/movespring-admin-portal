# movespring-admin-portal
This repository is for the admin portal for the MoveSpring project. All the source code for the website will be hosted here

## Development and verification

Run `npm install`, then `npm run dev`. Checks: `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run test:ui` (install Chromium once with `npx playwright install chromium`). Playwright starts Vite automatically when needed. Browser screenshots are written under the ignored `test-results/` directory.

`npm run test:layout` optionally compares every screen's text, native element structure, and geometry against an original checkout running on port 5174, at 1440px, 768px, and 390px widths. Give that checkout a separate Vite cache directory when sharing dependencies.

## Architecture and styling

- `src/core/theme/`: the single light/dark color palette, shared surface/shadow tokens, and persistent system/light/dark preference.
- `src/core/routing/router.ts`: the existing hash router, moved without route changes.
- `src/domain/`: entities, the portal repository contract, and challenge schedule validation. No React or concrete data dependencies.
- `src/data/repositories/samplePortal.ts`: the existing demo data, implementing the domain repository contract.
- `src/presentation/screens/`: all existing screens, moved from the original `auth` and parenthesized directories.
- `src/presentation/ui/`: shared Button, Card, Input/Select/Textarea, Modal, and NavBar. Card accepts native element types and supplies no padding so migrated content keeps its geometry.
- `src/presentation/styles/`: consolidated screen layouts and shared UI styles. Components contain no color literals or embedded stylesheets. Dynamic inline chart values remain data-driven.
- `src/presentation/PortalDataProvider.tsx`: injects the repository chosen by `src/App.jsx`; screens depend on the domain contract rather than a concrete data implementation.
- `src/presentation/animations/`: reusable loading, invitation falcon, and challenge success feedback, including reduced-motion fallbacks.

Authentication remains the original immediate mock unless a screen receives an asynchronous `onSuccessLogin` / `onSuccessRegister` callback. Loading tracks that callback and prevents duplicate submission. There is no artificial loading delay. Publish preserves its original callback/dashboard navigation and shows success after completion; rejected asynchronous callbacks show an error instead.

Invitation feedback uses `adminName` and the invitation's optional `name` or `firstName` / `lastName`. Existing invitation fixtures contain only email addresses, which are used as the fallback. `onResendInvitation` accepts an asynchronous send operation; the original default remains a mock confirmation rather than a real email integration.

The original Lottie JSON exports are installed: `public/assets/animations/auth-loading.json` is connected to authentication loading, and `public/assets/animations/challenge-created.json` is connected to successful publishing. Reduced motion and asset failures retain static fallbacks. The falcon is a local SVG/CSS animation. Production builds may report upstream `lottie-web` expression-engine eval warnings; the player is lazy-loaded in a separate chunk.
