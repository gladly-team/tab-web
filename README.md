# [Tab for a Cause](https://tab.gladly.io/)
*V4: adding server-side rendering*

## Documentation
### Authentication Approach
We use Firebase authentication, stored in IndexedDB, as the source of truth for user authentication. When the Firebase auth state changes, we call an endpoint to set client-side cookies that Next.js uses for server-side rendering. We do not store any session state on the server side.

Our app needs cookies set to `SameSite=None` because it may load in an iframe in the context of a browser extension new tab page.

With this approach:
* **We should use cookies as authentication *only* for server-side rendering of pages.** This reduces the surface area for CSRF attacks and simplifies cross-platform development.
* **Endpoints for pages must not change state.** These requests might be made by other sites, and session cookies will be included in those requests.
* **All API endpoints should rely on custom headers.** This provides basic protection against CSRF. Most API endpoints should use the `Authorization` header to get and validate the user's token. However, if an endpoint doesn't require authentication, it should verify that some other custom header is set, such as `X-Gladly-Requested-By'`.

On the `/api/logout` endpoint, we do not require the user to be authenticated, because if the user's Firebase credentials are invalidated or removed, the user would not be able to unset their session cookies and would continue to receive authed content until the session cookie expires. For basic CSRF protection, the logout endpoint verifies that the custom header `X-Gladly-Requested-By` is set.

In the future, we can consider adding session-based CSRF tokens for defense in depth.
