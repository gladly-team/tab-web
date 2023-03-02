import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { flowRight } from 'lodash/util'
import { get } from 'lodash/object'
import { graphql } from 'react-relay'
import { withAuthUser, AuthAction } from 'next-firebase-auth'
import { withSentry } from 'src/utils/pageWrappers/withSentry'
import withRelay from 'src/utils/pageWrappers/withRelay'
import CustomThemeHOC from 'src/utils/pageWrappers/CustomThemeHOC'
import withGoogleAnalyticsProperties from 'src/utils/pageWrappers/withGoogleAnalyticsProperties'
import useData from 'src/utils/hooks/useData'
import useCustomTheming from 'src/utils/hooks/useCustomTheming'
import SettingsPage from 'src/components/SettingsPage'
import AboutTheCause from 'src/components/AboutTheCause'

const getRelayQuery = ({ AuthUser }) => {
  const userId = AuthUser.id
  return {
    query: graphql`
      query aboutQuery($userId: String!) {
        user(userId: $userId) {
          cause {
            about
            impactType
            theme {
              primaryColor
              secondaryColor
            }
          }
        }
      }
    `,
    variables: {
      userId,
    },
  }
}

const AboutPage = ({ data: fallbackData }) => {
  const { data } = useData({ getRelayQuery, fallbackData })
  const fetchInProgress = !data
  const cause = get(data, 'user.cause')
  const theme = get(data, 'user.cause.theme', {})
  const { primaryColor, secondaryColor } = theme

  // Set the theme based on cause.
  const setTheme = useCustomTheming()
  useEffect(() => {
    setTheme({ primaryColor, secondaryColor })
  }, [setTheme, primaryColor, secondaryColor])

  return (
    <SettingsPage>
      {fetchInProgress ? null : <AboutTheCause cause={cause} />}
    </SettingsPage>
  )
}

AboutPage.displayName = 'AboutPage'
AboutPage.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.shape({
      cause: PropTypes.shape({
        about: PropTypes.string.isRequired,
        theme: PropTypes.shape({
          primaryColor: PropTypes.string.isRequired,
          secondaryColor: PropTypes.string.isRequired,
        }).isRequired,
      }),
    }).isRequired,
  }),
}
AboutPage.defaultProps = {
  data: undefined,
}

export default flowRight([
  withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withSentry,
  withRelay,
  withGoogleAnalyticsProperties,
  CustomThemeHOC,
])(AboutPage)
