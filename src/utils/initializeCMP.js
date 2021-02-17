import tabCMP from 'tab-cmp'
import logger from 'src/utils/logger'
import tabLogoWithText from 'src/assets/logos/logo-with-text.svg'

const initializeCMP = async () => {
  await tabCMP.initializeCMP({
    // Debugging can be enabled with URL param tabCMPDebug=true.
    debug: false,
    displayPersistentConsentLink: false,
    onError: (err) => {
      logger.error(err)
    },
    primaryButtonColor: '#9d4ba3',
    publisherName: 'Tab for a Cause',
    publisherLogo: tabLogoWithText,
  })
}

export default initializeCMP
