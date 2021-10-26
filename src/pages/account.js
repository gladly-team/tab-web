import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { unregister } from 'next-offline/runtime'
import { graphql } from 'react-relay'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
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
import SetUserCauseMutation from 'src/utils/mutations/SetUserCauseMutation'
import { withSentry } from 'src/utils/pageWrappers/withSentry'
import initializeCMP from 'src/utils/initializeCMP'
import useCustomTheming from 'src/utils/hooks/useCustomTheming'
import CustomThemeHOC from 'src/utils/pageWrappers/CustomThemeHOC'
import PetsIcon from '@material-ui/icons/Pets'
import SvgIcon from '@material-ui/core/SvgIcon'
import { mdiJellyfish } from '@mdi/js'
import { showInternalOnly } from 'src/utils/featureFlags'
import {
  STORAGE_CATS_CAUSE_ID,
  STORAGE_SEAS_CAUSE_ID,
} from '../utils/constants'

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
  advancedOptionsChildren: {
    display: 'flex',
    flexDirection: 'column',
  },
  revertButton: {
    marginBottom: theme.spacing(1),
  },
  revertButtonText: {
    lineHeight: '1.16',
    color: 'rgba(0, 0, 0, 0.54)',
    maxWidth: '80%',
  },
}))

const AccountItem = (props) => {
  const { actionButton, name, value, testId } = props
  const classes = useStyles()
  return (
    <div
      className={classes.accountItem}
      data-test-id={testId || 'account-item'}
    >
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
  testId: PropTypes.string,
}

AccountItem.defaultProps = {
  actionButton: null,
  value: null,
  testId: undefined,
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
          cause {
            causeId
            theme {
              primaryColor
              secondaryColor
            }
            landingPagePath
          }
        }
      }
    `,
    variables: {
      userId,
    },
  }
}

const Account = ({ data: fallbackData }) => {
  const { data } = useData({ getRelayQuery, fallbackData })
  const fetchInProgress = !data
  const { user } = data || {}
  const { id: userId, email, username, cause } = user || {}
  const { theme, landingPagePath, causeId } = cause || {}
  const { primaryColor, secondaryColor } = theme || {}
  const classes = useStyles()

  // currently storing causeId in state because of
  // @workaround/relay-page-data-bug
  // TODO: refactor to read and display causeId directly from
  // relay store
  const [currentCauseId, setCause] = useState(causeId)

  // Set the theme based on cause.
  const setTheme = useCustomTheming()
  useEffect(() => {
    setTheme({ primaryColor, secondaryColor })
  }, [setTheme, primaryColor, secondaryColor])
  useEffect(() => {
    setCause(causeId)
  }, [causeId])
  const AuthUser = useAuthUser()

  const switchCause = useCallback(
    async (_event, newCause) => {
      setCause(newCause)
      const {
        setUserCause: {
          user: {
            cause: {
              theme: {
                primaryColor: newPrimaryColor,
                secondaryColor: newSecondaryColor,
              },
            },
          },
        },
      } = await SetUserCauseMutation({ causeId: newCause, userId })
      setTheme({
        primaryColor: newPrimaryColor,
        secondaryColor: newSecondaryColor,
      })
    },
    [setCause, userId, setTheme]
  )

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
            color="default"
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
        {doesGDPRApply ? (
          <>
            <Divider />
            <AccountItem
              name="Data privacy choices"
              actionButton={
                <Button
                  color="default"
                  variant="contained"
                  onClick={() => tabCMP.openTCFConsentDialog()}
                >
                  Review choices
                </Button>
              }
              testId="data-privacy"
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
              testId="data-privacy"
            />
          </>
        ) : null}
        <Divider />
        {/* TODO: @workaround/tab-generalization */}
        <AccountItem
          name={`Leave Tab for ${
            landingPagePath === '/teamseas/' ? '#TeamSeas' : 'Cats'
          }`}
          actionButton={
            <div>
              <div>
                <Button
                  color="default"
                  variant="contained"
                  className={classes.revertButton}
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
              </div>
              <Typography
                variant="caption"
                className={classes.revertButtonText}
              >
                {/* TODO: @workaround/tab-generalization */}
                {`Warning: This will remove your ability to support ${
                  landingPagePath === '/teamseas/' ? '#teamseas' : 'cats'
                }. It will
                send you to classic Tab for a Cause, which has other 
                nonprofits you can support.`}
              </Typography>
            </div>
          }
          testId="revert-v4"
        />
        {/* Advanced Section of Profile Removed in commit associated with this comment */}
        {/* TODO: @workaround/tab-generalization */}
        {showInternalOnly(email) && (
          <>
            <Divider />
            <AccountItem
              name="Switch Cause"
              actionButton={
                <ToggleButtonGroup
                  color="primary"
                  value={currentCauseId}
                  exclusive
                  onChange={switchCause}
                >
                  <ToggleButton value={STORAGE_CATS_CAUSE_ID}>
                    <PetsIcon />
                  </ToggleButton>
                  <ToggleButton value={STORAGE_SEAS_CAUSE_ID}>
                    <SvgIcon>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d={mdiJellyfish}
                        fill="inherit"
                      />
                    </SvgIcon>
                  </ToggleButton>
                </ToggleButtonGroup>
              }
              testId="switch-cause"
            />
          </>
        )}
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
      cause: PropTypes.shape({
        theme: PropTypes.shape({
          primaryColor: PropTypes.string,
          secondaryColor: PropTypes.string,
        }),
        landingPagePath: PropTypes.string,
      }),
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
  CustomThemeHOC,
])(Account)
