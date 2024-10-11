import React, { useEffect, useState, useCallback, forwardRef } from 'react'
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
import Tooltip from '@material-ui/core/Tooltip'
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
import withGoogleAnalyticsProperties from 'src/utils/pageWrappers/withGoogleAnalyticsProperties'
import CauseIcon from 'src/components/CauseIcon'
import localStorageFeaturesManager from 'src/utils/localStorageFeaturesManager'
import { LAUNCH_BOOKMARKS } from 'src/utils/experiments'
import Switch from '@material-ui/core/Switch'
import localStorageMgr from 'src/utils/localstorage-mgr'
import {
  STORAGE_NEW_USER_IS_TAB_V4_BETA,
  WIDGET_TYPE_BOOKMARKS,
} from 'src/utils/constants'
import UpdateWidgetEnabledMutation from 'src/utils/mutations/UpdateWidgetEnabledMutation'

const useStyles = makeStyles((theme) => ({
  contentContainer: {
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
  causeButtonContent: {
    display: 'block',
    width: '100%',
    height: '100%',
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
            name
            theme {
              primaryColor
              secondaryColor
            }
          }
          widgets {
            edges {
              node {
                id
                name
                type
                enabled
              }
            }
          }
        }
        app {
          causes(first: 50, filters: { isAvailableToSelect: true }) {
            edges {
              node {
                causeId
                isAvailableToSelect
                name
                icon
                theme {
                  primaryColor
                  secondaryColor
                }
              }
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

// Wrap ToggleButton in a Tooltip. See:
// https://github.com/mui/material-ui/issues/18091#issuecomment-1019191094
const TooltipToggleButton = forwardRef(({ TooltipProps, ...props }, ref) => (
  // eslint-disable-next-line react/jsx-no-comment-textnodes, react/jsx-props-no-spreading
  <Tooltip {...TooltipProps}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <ToggleButton ref={ref} {...props} />
  </Tooltip>
))
TooltipToggleButton.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  TooltipProps: PropTypes.object,
}
TooltipToggleButton.defaultProps = {
  TooltipProps: {},
}

const Account = ({ data: fallbackData }) => {
  const { data } = useData({ getRelayQuery, fallbackData })
  const fetchInProgress = !data
  const { user, app } = data || {}
  const { causes: { edges: causeNodes = [] } = {} } = app || {}
  const {
    id: userId,
    email,
    username,
    cause,
    widgets: { edges: widgetNodes = [] } = {},
  } = user || {}
  const { theme, causeId, name = '' } = cause || {}
  const { primaryColor, secondaryColor } = theme || {}
  const classes = useStyles()

  // currently storing causeId and name in state because of
  // @workaround/relay-page-data-bug
  // TODO: refactor to read and display causeId directly from
  // relay store
  const [currentCauseId, setCause] = useState(causeId)
  const [currentCauseName, setCauseName] = useState(name)

  // Set the theme based on cause.
  const setTheme = useCustomTheming()
  useEffect(
    () => setTheme({ primaryColor, secondaryColor }),
    [setTheme, primaryColor, secondaryColor]
  )
  useEffect(() => setCause(causeId), [causeId])
  useEffect(() => setCauseName(name), [name])
  const AuthUser = useAuthUser()

  const switchCause = useCallback(
    async (_event, newCause) => {
      if (newCause !== null) {
        setCause(newCause)
        const {
          setUserCause: {
            user: {
              cause: {
                name: newName,
                theme: {
                  primaryColor: newPrimaryColor,
                  secondaryColor: newSecondaryColor,
                },
              },
            },
          },
        } = await SetUserCauseMutation({ causeId: newCause, userId })
        setCauseName(newName)
        setTheme({
          primaryColor: newPrimaryColor,
          secondaryColor: newSecondaryColor,
        })
      }
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

    // eslint-disable-next-line no-undef
    document.cookie = 'tabV4OptIn=enabled; Max-Age=-99999999;'

    if (response.ok) {
      // Clear local storage.
      localStorageMgr.removeItem(STORAGE_NEW_USER_IS_TAB_V4_BETA)

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

  const [bookmarks, setBookmarks] = useState(false)
  const [bookmarkWidget, setBookmarkWidget] = useState(null)
  const handleBookmarks = async (event) => {
    setBookmarks(event.target.checked)
    await UpdateWidgetEnabledMutation(user, bookmarkWidget.node, !bookmarks)
  }

  // TODO: @jedtan Refactor into separate component if needed
  useEffect(() => {
    setBookmarkWidget(
      widgetNodes.find(
        (widgetNode) => widgetNode.node.type === WIDGET_TYPE_BOOKMARKS
      )
    )
    setBookmarks(!!(bookmarkWidget && bookmarkWidget.node.enabled))
  }, [widgetNodes, bookmarkWidget])

  return (
    <SettingsPage>
      <Paper elevation={1} className={classes.contentContainer}>
        <div className={classes.titleContainer}>
          <Typography variant="h5" className={classes.title}>
            New Tab Page
          </Typography>
        </div>
        <Divider />
        <AccountItem
          name="Switch Cause"
          actionButton={
            <ToggleButtonGroup
              color="primary"
              value={currentCauseId}
              exclusive
              checked={bookmarks}
              onChange={switchCause}
            >
              {causeNodes.map(
                ({
                  node: { causeId: causeIdGlobal, icon, name: causeName },
                }) => (
                  <TooltipToggleButton
                    key={causeIdGlobal}
                    value={causeIdGlobal}
                    TooltipProps={{ title: `Tab for ${causeName}` }}
                  >
                    <CauseIcon icon={icon} />
                  </TooltipToggleButton>
                )
              )}
            </ToggleButtonGroup>
          }
          testId="switch-cause"
        />
        {localStorageFeaturesManager.getFeatureValue(LAUNCH_BOOKMARKS) !==
          'false' && <Divider />}
        {localStorageFeaturesManager.getFeatureValue(LAUNCH_BOOKMARKS) !==
          'false' && (
          <AccountItem
            name="Shortcuts"
            actionButton={
              <Switch
                checked={bookmarks}
                onChange={handleBookmarks}
                color="primary"
              />
            }
            testId="switch-cause"
          />
        )}
      </Paper>
      <Paper elevation={1} className={classes.contentContainer}>
        <div className={classes.titleContainer}>
          <Typography variant="h5" className={classes.title}>
            Account
          </Typography>
          <Button
            variant="outlined"
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
        <AccountItem
          name={fetchInProgress ? '...' : `Leave Tab for ${currentCauseName}`}
          actionButton={
            <div>
              <div>
                <Button
                  variant="outlined"
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
                {`Warning: This will remove your ability to support your current cause. It will
                send you to classic Tab for a Cause, which has other 
                nonprofits you can support.`}
              </Typography>
            </div>
          }
          testId="revert-v4"
        />
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
        name: PropTypes.string,
      }),
      widgets: PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string,
            enabled: PropTypes.bool,
            name: PropTypes.string,
            type: PropTypes.string,
          })
        ),
      }).isRequired,
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
  withGoogleAnalyticsProperties,
  CustomThemeHOC,
])(Account)
