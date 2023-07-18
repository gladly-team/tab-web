import ensureValuesAreDefined from 'src/utils/ensureValuesAreDefined'
import { withBasePath } from 'src/utils/navigationUtils'
import { MEDIA_ENDPOINT } from 'src/utils/constants'

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
export const aboutURL = createPageURL('/about')
export const achievementsURL = createPageURL('/achievements')
export const authURL = createPageURL('/auth')
export const betaOptInURL = createPageURL('/beta-opt-in')
export const dashboardURL = createPageURL('/')
export const missionHubURL = createPageURL('/missions')

// For progressive web app.
export const PWAManifestURL = withBasePath('/manifest.json')

// Various links.
export const EXTERNAL_CONTACT_US_URL =
  'https://gladly.zendesk.com/hc/en-us/requests/new'
export const EXTERNAL_CLEAR_COOKIES_HELP_PAGE =
  'https://gladly.zendesk.com/hc/en-us/articles/360002317231-How-do-I-clear-my-cookies-and-site-data-for-Tab-for-a-Cause-'
export const HELP_URL = 'https://tab.gladly.io/help/'
export const FINANCIALS_URL = 'https://tab.gladly.io/financials/'
export const GET_SEARCH_URL = 'https://tab.gladly.io/get-search/'
export const SFAC_FEEDBACK_LINK = 'https://forms.gle/A3Xam2op2gFjoQNU6'
export const ONE_AND_A_HALF_MILLION_RAISED_URL =
  'https://tab.gladly.io/million-and-a-half/'

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
export const surveyLink =
  'https://docs.google.com/forms/d/e/1FAIpQLScS8RmMy1AvYHuBJPrNSnB9TOgG8Lq24ODh1RlODeIsw0U1MA/viewform?usp=sf_link'

export const media = (imgPath) => `${MEDIA_ENDPOINT}/img/cause/${imgPath}`

// Social
export const facebookPageURL = 'https://www.facebook.com/TabForACause'
export const instagramPageURL = 'https://www.instagram.com/tabforacause/'
export const twitterPageURL = 'https://twitter.com/TabForACause'
export const tiktokPageURL = 'https://www.tiktok.com/@tabforacause'

// Extensions
export const chromeExtensionURL =
  'https://chrome.google.com/webstore/detail/tab-for-a-cause/gibkoahgjfhphbmeiphbcnhehbfdlcgo'
export const edgeExtensionURL =
  'https://microsoftedge.microsoft.com/addons/detail/hmiiajmhelfgiaoboffbjpjdckbmnddg'
export const safariExtensionURL =
  'https://apps.apple.com/us/app/tab-for-a-cause/id1579749108'

// Zendesk
export const externalHelpURL =
  'https://gladly.zendesk.com/hc/en-us/categories/201939608-Tab-for-a-Cause'

// For Footer
export const adblockerWhitelistingURL = 'https://tab.gladly.io/adblockers'
export const contactUsURL = 'https://tab.gladly.io/contact'
export const privacyPolicyURL = 'https://tab.gladly.io/privacy'
export const teamURL = 'https://tab.gladly.io/team'
export const termsURL = 'https://tab.gladly.io/terms'
export const jobsURL = 'https://tab.gladly.io/jobs'

export const searchLandingURL = 'https://search.gladly.io/'
export const shopLandingURL = 'https://shop.gladly.io/'

export const groupImpactLeaderboardFAQ =
  'https://gladly.zendesk.com/hc/en-us/articles/17622871939725-Leaderboards'
