import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { flowRight } from 'lodash/util'
import { get } from 'lodash/object'
import { graphql } from 'react-relay'
import { withAuthUser, AuthAction } from 'next-firebase-auth'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import { withSentry } from 'src/utils/pageWrappers/withSentry'
import withRelay from 'src/utils/pageWrappers/withRelay'
import CustomThemeHOC from 'src/utils/pageWrappers/CustomThemeHOC'
import withGoogleAnalyticsProperties from 'src/utils/pageWrappers/withGoogleAnalyticsProperties'
import useData from 'src/utils/hooks/useData'
import useCustomTheming from 'src/utils/hooks/useCustomTheming'
import SettingsPage from 'src/components/SettingsPage'
import Markdown from 'src/components/Markdown'

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    width: '100%',
    margin: theme.spacing(2),
    padding: theme.spacing(3),

    // Compensate for markdown paragraph's margin-bottom
    paddingBottom: theme.spacing(2),
  },
}))

const getRelayQuery = ({ AuthUser }) => {
  const userId = AuthUser.id
  return {
    query: graphql`
      query aboutQuery($userId: String!) {
        user(userId: $userId) {
          cause {
            about
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
  const about = get(data, 'user.cause.about')
  const theme = get(data, 'user.cause.theme', {})
  const { primaryColor, secondaryColor } = theme
  const classes = useStyles()

  // Set the theme based on cause.
  const setTheme = useCustomTheming()
  useEffect(() => {
    setTheme({ primaryColor, secondaryColor })
  }, [setTheme, primaryColor, secondaryColor])

  return (
    <SettingsPage>
      {fetchInProgress ? null : (
        <Paper elevation={1} className={classes.contentContainer}>
          <Markdown>{about}</Markdown>
        </Paper>
      )}
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
