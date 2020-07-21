[![codecov](https://codecov.io/gh/gladly-team/tab-web/branch/master/graph/badge.svg?token=Hbjg2dNtLv)](https://codecov.io/gh/gladly-team/tab-web)

# [Tab for a Cause](https://tab.gladly.io/)
*V4: adding server-side rendering*

## Getting Started

1. `git clone git@github.com:gladly-team/tab-web.git`
2. `cd tab-web`
3. `yarn`
4. `yarn go`

*Note: this also requires a running GraphQL service endpoint. We may want to update the default endpoint to a dev endpoint in the cloud for a better develeoper experience.*

## Documentation
### File Structure
Our pages are in the `containers` directory, which allows us to colocate their tests. Currently, Next.js doesn't support non-page files in the `pages` directory (see [issue](https://github.com/zeit/next.js/issues/3728#issuecomment-363964953)). Files in the `pages` directory should simply export matching files in `containers`.
### Authentication
We use Firebase JS SDK authentication as the source of truth for user authentication. When the Firebase auth state changes, we call an endpoint to set client-side cookies that Next.js uses for server-side rendering. We do not store any session state on the server side.

Our app needs cookies set to `SameSite=None` because it may load in an iframe in the context of a browser extension new tab page.

With this approach:
* **We should use cookies as authentication *only* for server-side rendering of pages.** This reduces the surface area for CSRF attacks and simplifies cross-platform development.
* **Endpoints for pages must not change state.** These requests might be made by other sites, and session cookies will be included in those requests.
* **All API endpoints should rely on custom headers.** This provides basic protection against CSRF. Most API endpoints should use the `Authorization` header to get and validate the user's token. However, if an endpoint doesn't require authentication, it should verify that some other custom header is set, such as `X-Gladly-Requested-By'`.

On the `/api/logout` endpoint, we do not require the user to be authenticated, because if the user's Firebase credentials are invalidated or removed, the user would not be able to unset their session cookies and would continue to receive authed content until the session cookie expires. For basic CSRF protection, the logout endpoint verifies that the custom header `X-Gladly-Requested-By` is set.

In the future, we can consider adding session-based CSRF tokens for defense in depth.

### Deployment
**Vercel runs unit tests and deploys**
* Our Vercel project, [tab-web](https://vercel.com/gladly-team/tab-web), builds on commit push
* Environment variables are set in the Vercel console, and we keep values in `.env.info` for reference
* The "dev" Git branch is mapped to our "dev" environment

**Github Action logs code coverage**
* A Node Github action runs test coverage and logs to [Codecov](https://codecov.io/gh/gladly-team/tab-web)

As needed, we may want to move the workflow entirely into a CI system.
