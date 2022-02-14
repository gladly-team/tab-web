import fbq from 'src/utils/facebook-analytics'
import rdt from 'src/utils/reddit-analytics'
import gtag from 'src/utils/google-analytics'

// Call once on a new user's first tab.
export const accountCreated = () => {
  fbq('track', 'CompleteRegistration', { content_name: 'AccountCreated' })
  rdt('track', 'SignUp')

  // https://developers.google.com/analytics/devguides/collection/ga4/reference/events#sign_up
  gtag('event', 'sign_up')
}

// Call on each new tab.
export const newTabView = () => {
  fbq('track', 'PageView')
  fbq('track', 'ViewContent', { content_name: 'Newtab' })
}
