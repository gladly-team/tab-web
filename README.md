[![codecov](https://codecov.io/gh/gladly-team/tab-web/branch/master/graph/badge.svg?token=Hbjg2dNtLv)](https://codecov.io/gh/gladly-team/tab-web)

# [Tab for a Cause](https://tab.gladly.io/)

🚨 **Work in progress** 🚨: see [gladly-team/tab](https://github.com/gladly-team/tab) for the production web app

## Getting Started

1. `git clone git@github.com:gladly-team/tab-web.git`
2. `cd tab-web`
3. `yarn`
4. Set up local secret environment varables
    1. Copy `.env.local.info` to `.env.local`
    2. Set `FIREBASE_PRIVATE_KEY` to the staging environment key
    3. Set cookie secrets to sufficiently long, random strings
5. Create a user (by default, this repo relies on a cloud backend)
    1. Visit [this staging environment](https://dev-tab2017.gladly.io/newtab/)
    2. Sign up with **username and email**, not 3rd-party auth
6. `yarn go`
7. Visit `http://localhost:3001` and sign in with the user you created above

## Documentation

### File Structure

Tests for our pages are in the `src/__tests__` directory. Currently, Next.js doesn't support non-page files in the `pages` directory (see [issue](https://github.com/zeit/next.js/issues/3728#issuecomment-363964953)).

### Authentication

We use Firebase JS SDK authentication as the source of truth for user authentication. When the Firebase auth state changes, we call an endpoint to set client-side cookies that Next.js uses for server-side rendering. We do not store any session state on the server side.

Our app needs cookies set to `SameSite=None` because it may load in an iframe in the context of a browser extension new tab page.

With this approach:

- **We should use cookies as authentication _only_ for server-side rendering of pages.** This reduces the surface area for CSRF attacks and simplifies cross-platform development.
- **Endpoints for pages must not change state.** These requests might be made by other sites, and session cookies will be included in those requests.
- **All API endpoints should rely on custom headers.** This provides [basic protection](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.md#use-of-custom-request-headers) against CSRF, given our requirement for `SameSite=None` cookies. Most API endpoints should use the `Authorization` header to get and validate the user's token. However, if an endpoint doesn't require authentication, it should verify that some other custom header is set, such as `X-Gladly-Requested-By'`.

On the `/api/logout` endpoint, we do not require the user to be authenticated, because if the user's Firebase credentials are invalidated or removed, the user would not be able to unset their session cookies and would continue to receive authed content until the session cookie expires. For basic CSRF protection, the logout endpoint verifies that the custom header `X-Gladly-Requested-By` is set.

In the future, we can consider adding session-based CSRF tokens for defense in depth.

### Environment Variables

- **Production:** set in the Vercel console for preview and production deployments.
  - For reference, we add non-secret env values to `.env.preview.info` and `.env.production.info`.
- **Local development:** set in `.env.development` (public) and `.env.local` (secrets).
- See [.env](./.env) for more documentation.

### Deployment

**Vercel runs unit tests and deploys**

- Our Vercel project, [tab-web](https://vercel.com/gladly-team/tab-web), builds on commit push
- The "dev" Git branch is mapped to our "dev" environment

**GitHub Action runs unit tests and logs code coverage**

- A GitHub Action runs tests and logs code coverage to [Codecov](https://codecov.io/gh/gladly-team/tab-web)
