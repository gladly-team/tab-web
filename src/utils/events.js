// Call once on a new user's first tab.
import fbq from 'src/utils/facebook-analytics'
import rdt from 'src/utils/reddit-analytics'

export const accountCreated = () => {
  fbq('track', 'CompleteRegistration', { content_name: 'AccountCreated' })
  rdt('track', 'SignUp')
}

// Call on each new tab.
export const newTabView = () => {
  fbq('track', 'PageView')
  fbq('track', 'ViewContent', { content_name: 'Newtab' })
}
