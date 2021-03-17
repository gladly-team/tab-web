import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { unregister } from 'next-offline/runtime'
import { graphql } from 'react-relay'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { flowRight } from 'lodash/util'
import { withAuthUser, AuthAction, useAuthUser } from 'next-firebase-auth'
import tabCMP from 'tab-cmp'
import withRelay from 'src/utils/pageWrappers/withRelay'
import useData from 'src/utils/hooks/useData'
import SettingsPage from 'src/components/SettingsPage'
import logout from 'src/utils/auth/logout'
import { apiBetaOptIn, dashboardURL } from 'src/utils/urls'
import { clearAllServiceWorkerCaches } from 'src/utils/caching'
import { setWindowLocation } from 'src/utils/navigation'
import SetV4BetaMutation from 'src/utils/mutations/SetV4BetaMutation'
import { withSentry } from 'src/utils/pageWrappers/withSentry'
import initializeCMP from 'src/utils/initializeCMP'

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    width: '100%',
    margin: theme.spacing(2),
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    padding: theme.spacing(3),
  },
  logoutButton: {
    margin: theme.spacing(2),
  },
  accountItem: {
    display: 'flex',
    alignItems: 'center',
    padding: 20,
  },
  accountItemName: {
    flex: 1,
    fontWeight: 'bold',
  },
  accountItemValue: {
    flex: 2,
  },
  accountItemActionButton: {
    flex: 2,
  },
}))

const AccountItem = (props) => {
  const { actionButton, name, value } = props
  const classes = useStyles()
  return (
    <div className={classes.accountItem} data-test-id="account-item">
      <Typography variant="body2" className={classes.accountItemName}>
        {name}
      </Typography>
      {value ? (
        <Typography variant="body2" className={classes.accountItemValue}>
          {value}
        </Typography>
      ) : null}
      {actionButton ? (
        <div className={classes.accountItemActionButton}>{actionButton}</div>
      ) : null}
    </div>
  )
}

AccountItem.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  actionButton: PropTypes.element,
}

AccountItem.defaultProps = {
  actionButton: null,
  value: null,
}

const getRelayQuery = ({ AuthUser }) => {
  const userId = AuthUser.id
  return {
    query: graphql`
      query accountQuery($userId: String!) {
        user(userId: $userId) {
          email
          id
          username
        }
      }
    `,
    variables: {
      userId,
    },
  }
}

const Account = ({ data: initialData }) => {
  const { data } = useData({ getRelayQuery, initialData })
  const fetchInProgress = !data
  const { user } = data || {}
  const { id: userId, email, username } = user || {}
  const classes = useStyles()

  const AuthUser = useAuthUser()

  // Conditionally show privacy management buttons.
  const [doesGDPRApply, setDoesGDPRApply] = useState(false)
  const [doesCCPAApply, setDoesCCPAApply] = useState(false)

  useEffect(() => {
    const initCMP = async () => {
      await initializeCMP()

      // Determine if any data privacy frameworks apply.
      const gdprApplies = await tabCMP.doesGDPRApply()
      if (gdprApplies) {
        setDoesGDPRApply(true)
      }
      const ccpaApplies = await tabCMP.doesCCPAApply()
      if (ccpaApplies) {
        setDoesCCPAApply(true)
      }
    }
    initCMP()
  }, [])

  // Logging out.
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const onLogoutClick = async () => {
    setIsLoggingOut(true)
    await logout(AuthUser)
  }

  // Switching to classic tab page.
  const [isRevertingToClassicTab, setIsRevertingToClassicTab] = useState(false)
  const setBetaOptIn = async (isOptedIn) => {
    const response = await fetch(apiBetaOptIn, {
      method: 'POST',
      headers: {
        // This custom header provides modest CSRF protection. See:
        // https://github.com/gladly-team/tab-web#authentication-approach
        'X-Gladly-Requested-By': 'tab-web-nextjs',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ optIn: isOptedIn }),
    })

    if (response.ok) {
      // On beta status change, remove cached data.
      await clearAllServiceWorkerCaches()

      // If opting out, unregister the service worker.
      if (!isOptedIn) {
        unregister()
      }

      // Set the "v4 beta enabled" flag to false on the user's
      // profile.s
      if (userId) {
        await SetV4BetaMutation({ enabled: false, userId })
      }

      // Go to the dashboard.
      setWindowLocation(dashboardURL)
    }
  }
  return (
    <SettingsPage>
      <Paper elevation={1} className={classes.contentContainer}>
        <div className={classes.titleContainer}>
          <Typography variant="h5" className={classes.title}>
            Account
          </Typography>
          <Button
            variant="contained"
            onClick={onLogoutClick}
            disabled={isLoggingOut}
            className={classes.logoutButton}
          >
            {isLoggingOut ? 'Logging Out...' : 'Log Out'}
          </Button>
        </div>
        <Divider />
        <AccountItem
          name="Username"
          value={fetchInProgress ? '...' : username || 'Not signed in'}
        />
        <Divider />
        <AccountItem
          name="Email"
          value={fetchInProgress ? '...' : email || 'Not signed in'}
        />
        <Divider />
        <AccountItem
          name="Beta Enabled"
          actionButton={
            <Button
              variant="contained"
              disabled={isRevertingToClassicTab}
              onClick={() => {
                setIsRevertingToClassicTab(true)
                setBetaOptIn(false)
              }}
            >
              {isRevertingToClassicTab
                ? 'Switching Back...'
                : 'Switch to Classic'}
            </Button>
          }
        />
        {doesGDPRApply ? (
          <>
            <Divider />
            <AccountItem
              name="Data privacy choices"
              actionButton={
                <Button
                  variant="contained"
                  onClick={() => tabCMP.openTCFConsentDialog()}
                >
                  Review choices
                </Button>
              }
            />
          </>
        ) : null}
        {doesCCPAApply ? (
          <>
            <Divider />
            <AccountItem
              name="Ad personalization choices"
              actionButton={
                <div>
                  {/* Disable a11y tags that are incompatible with Next.js */}
                  {/* eslint-disable-next-line */}
                  <a onClick={() => tabCMP.openCCPAConsentDialog()}>
                    <Typography
                      variant="body2"
                      style={{ textDecoration: 'underline', cursor: 'pointer' }}
                      gutterBottom
                    >
                      Do Not Sell My Info
                    </Typography>
                  </a>
                  <Typography
                    variant="caption"
                    style={{
                      lineHeight: '1.16',
                      color: 'rgba(0, 0, 0, 0.54)',
                      maxWidth: '80%',
                    }}
                  >
                    This preference sets whether advertisers can personalize ads
                    to you. Personalized ads can be more interesting and often
                    raise more money for charity. We{' '}
                    <span style={{ fontWeight: 'bold' }}>never</span> sell
                    personal information like email addresses, nor do we collect
                    your browsing history on other sites.
                  </Typography>
                </div>
              }
            />
          </>
        ) : null}
      </Paper>
    </SettingsPage>
  )
}

Account.displayName = 'Account'
Account.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.shape({
      email: PropTypes.string,
      id: PropTypes.string,
      username: PropTypes.string,
    }),
  }),
}
Account.defaultProps = {
  data: undefined,
}

export default flowRight([
  withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withSentry,
  withRelay,
])(Account)
