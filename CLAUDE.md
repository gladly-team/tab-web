# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development

- `yarn go` or `yarn dev` - Start development server on port 3001
- `yarn build` - Production build (includes Relay compilation)
- `yarn start` - Start production server

### Testing

- `yarn test` - Run linting and unit tests
- `yarn test:watch` - Run tests in watch mode
- `yarn test:coverage` - Generate test coverage report
- `yarn test:e2e` - Run end-to-end tests
- Running a single test: `yarn jest path/to/test.js`

### Code Quality

- `yarn lint` - Run ESLint
- `yarn format:fix` - Auto-format code with Prettier
- `yarn relay` - Compile GraphQL queries with Relay (required before testing)

### Development Tools

- `yarn storybook` - Start Storybook on port 6006

## Architecture Overview

### Technology Stack

- **Frontend**: Next.js 10.2.3 with React 17
- **Styling**: Material-UI v4 (migrating to MUI v5), Emotion for CSS-in-JS
- **Data Layer**: GraphQL with Relay for state management
- **Authentication**: Firebase Auth with next-firebase-auth for SSR
- **Analytics**: Google Analytics, Sentry for error tracking
- **Testing**: Jest with Enzyme

### Key Architectural Patterns

1. **Authentication Flow**

   - Firebase JS SDK is the source of truth
   - Server-side rendering uses cookies set to `SameSite=None`
   - API endpoints require custom headers (Authorization or X-Gladly-Requested-By) for CSRF protection
   - Pages must not change state (GET requests only)

2. **Data Fetching**

   - GraphQL queries/mutations via Relay
   - Mutations are in `src/utils/mutations/`
   - Generated GraphQL artifacts in `src/relay/__generated__/`

3. **Component Organization**

   - Pages in `src/pages/` (Next.js routing)
   - Reusable components in `src/components/`
   - Component tests alongside components as `*.test.js`
   - Storybook stories as `*.stories.jsx`

4. **Feature Management**
   - GrowthBook for A/B testing and feature flags
   - Local storage management for user preferences

## Important Notes

- The app loads in browser extension iframes, requiring `SameSite=None` cookies
- Environment variables are documented in `.env` files
- Dev branch deploys to staging environment
- Tests must pass before deployment via GitHub Actions and Vercel
