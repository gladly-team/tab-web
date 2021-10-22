import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'
import { withBasePath } from 'src/utils/navigationUtils'

try {
  ensureValuesAreDefined([
    process.env.NEXT_PUBLIC_URLS_BASE_PATH,
    process.env.NEXT_PUBLIC_URLS_USE_TRAILING_SLASH,
  ])
} catch (e) {
  throw new Error(
    'Environment variables NEXT_PUBLIC_URLS_BASE_PATH and NEXT_PUBLIC_URLS_USE_TRAILING_SLASH must be set.'
  )
}

const useTrailingSlash =
  process.env.NEXT_PUBLIC_URLS_USE_TRAILING_SLASH === 'true'

const addTrailingSlashIfNeeded = (path) => {
  const hasTrailingSlash = path[path.length - 1] === '/'
  return `${path}${!hasTrailingSlash && useTrailingSlash ? '/' : ''}`
}

// For /api/* paths.
const createAPIURL = (url) =>
  addTrailingSlashIfNeeded(`${process.env.NEXT_PUBLIC_URLS_BASE_PATH}${url}`)

const createPageURL = (url) => addTrailingSlashIfNeeded(url)

export const apiLogin = createAPIURL('/api/login')
export const apiLogout = createAPIURL('/api/logout')
export const apiBetaOptIn = createAPIURL('/api/beta-opt-in')

export const accountURL = createPageURL('/account')
export const achievementsURL = createPageURL('/achievements')
export const authURL = createPageURL('/auth')
export const betaOptInURL = createPageURL('/beta-opt-in')
export const dashboardURL = createPageURL('/')
export const missionHubURL = createPageURL('/missions')

// For progressive web app.
export const PWAManifestURL = withBasePath('/manifest.json')
export const EXTERNAL_CONTACT_US_URL =
  'https://gladly.zendesk.com/hc/en-us/requests/new'
export const HELP_URL = 'https://tab.gladly.io/help/'
export const FINANCIALS_URL = 'https://tab.gladly.io/financials/'
// eslint-disable-next-line no-undef
export const reload = () => window.location.reload()
export const externalNavigation = (url) => {
  // eslint-disable-next-line no-undef
  window.location = url
}
export const constructBaseUrl = (landingPagePath) =>
  `https://tab.gladly.io${landingPagePath || '/'}`
export const getReferralUrl = (username, landingPagePath) => {
  const referralUrl = username
    ? `${constructBaseUrl(landingPagePath)}?u=${encodeURIComponent(username)}`
    : constructBaseUrl(landingPagePath)
  return referralUrl
}
export const getSquadsLink = (username, squadId, landingPagePath) =>
  `${constructBaseUrl(landingPagePath)}?u=${encodeURIComponent(
    username
  )}&m=${encodeURIComponent(squadId)}`
export const surveyLink = 'https://forms.gle/wT9qattFPBW9dZb57'
