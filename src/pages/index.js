// libraries
import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { flowRight } from 'lodash/util'
import { isNil } from 'lodash/lang'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { graphql } from 'react-relay'
import { AdComponent, fetchAds } from 'tab-ads'
import { v4 as uuid } from 'uuid'
import { get } from 'lodash/object'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import { useGrowthBook } from '@growthbook/growthbook-react'

// custom components
import Achievement from 'src/components/Achievement'
import Link from 'src/components/Link'
import Logo from 'src/components/Logo'
import MoneyRaisedContainer from 'src/components/MoneyRaisedContainer'
import UserBackgroundImageContainer from 'src/components/UserBackgroundImageContainer'
import UserImpactContainer from 'src/components/UserImpactContainer'
import MissionHubButton from 'src/components/MissionHubButton'
import InviteFriendsIconContainer from 'src/components/InviteFriendsIconContainer'
import SquadCounter from 'src/components/SquadCounter'
import CustomThemeHOC from 'src/utils/pageWrappers/CustomThemeHOC'
import withGoogleAnalyticsProperties from 'src/utils/pageWrappers/withGoogleAnalyticsProperties'
import SfacActivityContainer from 'src/components/SfacActivityContainer'

// material components
import { makeStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
import Button from '@material-ui/core/Button'
import Chip from '@material-ui/core/Chip'

// utils
import withDataSSR from 'src/utils/pageWrappers/withDataSSR'
import withRelay from 'src/utils/pageWrappers/withRelay'
import { withSentry, withSentrySSR } from 'src/utils/pageWrappers/withSentry'
import logUncaughtErrors from 'src/utils/pageWrappers/logUncaughtErrors'
import localStorageMgr from 'src/utils/localstorage-mgr'

import LogTabMutation from 'src/utils/mutations/LogTabMutation'
import UpdateImpactMutation from 'src/utils/mutations/UpdateImpactMutation'
import LogUserRevenueMutation from 'src/utils/mutations/LogUserRevenueMutation'
import SetHasViewedIntroFlowMutation from 'src/utils/mutations/SetHasViewedIntroFlowMutation'
import { getHostname, getCurrentURL, goTo } from 'src/utils/navigation'
import {
  getAdUnits,
  areAdsEnabled,
  showMockAds,
  isGAMDevEnvironment,
  incrementTabsOpenedToday,
} from 'src/utils/adHelpers'
import { isClientSide } from 'src/utils/ssr'
import {
  aboutURL,
  accountURL,
  achievementsURL,
  ONE_AND_A_HALF_MILLION_RAISED_URL,
} from 'src/utils/urls'
import {
  showMockAchievements,
  showBackgroundImages,
  showDevelopmentOnlyMissionsFeature,
  showInternalOnly,
} from 'src/utils/featureFlags'
import logger from 'src/utils/logger'
import FullPageLoader from 'src/components/FullPageLoader'
import useData from 'src/utils/hooks/useData'
import {
  CAT_CHARITY,
  STORAGE_NEW_USER_CAUSE_ID,
  HAS_SEEN_SEARCH_V2_TOOLTIP,
  NOTIF_DISMISS_PREFIX,
  CAUSE_IMPACT_TYPES,
} from 'src/utils/constants'
import OnboardingFlow from 'src/components/OnboardingFlow'
import { accountCreated, newTabView } from 'src/utils/events'
import useCustomTheming from 'src/utils/hooks/useCustomTheming'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import { validateAttributesObject } from 'src/utils/growthbook'
import SearchInputContainer from 'src/components/SearchInputContainer'
import SearchForACauseSellModal from 'src/components/SearchForACauseSellModal'
import Notification from 'src/components/Notification'
import SearchForACauseSellNotification from 'src/components/SearchForACauseSellNotification'
import { getFeatureValue } from 'src/utils/growthbookUtils'
import { YAHOO_SEARCH_NEW_USERS_V2 } from 'src/utils/experiments'
import SfacExtensionSellNotification from 'src/components/SfacExtensionSellNotification'
import useDoesBrowserSupportSearchExtension from 'src/utils/hooks/useDoesBrowserSupportSearchExtension'
import useBrowserName from 'src/utils/hooks/useBrowserName'
import { isSearchActivityComponentSupported } from 'src/utils/browserSupport'
import localStorageFeaturesManager from 'src/utils/localStorageFeaturesManager'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    height: '100vh',
    width: '100vw',

    // Use a dark background rather than white one to mitigate irritation for
    // users who use dark mode. Equivalent to the default dark mode value for
    // MUI `theme.palette.background.paper`:
    // https://mui.com/material-ui/customization/default-theme/?expand-path=$.palette
    // When dark mode is supported, use the theme instead.
    background: '#121212',

    overflow: 'hidden',
  },
  OnboardingFlow: {
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'auto',
  },
  fullContainer: {
    position: 'absolute',
    zIndex: 1e3,
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  topContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignContent: 'flex-start',
  },
  topRightContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userMenuContainer: {
    alignSelf: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(0),
  },
  settingsIconContainer: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  settingsIcon: {
    height: 20,
    width: 20,
    color: get(theme, 'palette.backgroundContrastText.main'),
  },
  notification: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
  },
  notificationsContainer: {
    width: 400,
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(1),
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  notificationButtonsWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  achievementsContainer: {
    alignSelf: 'flex-end',
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.1s ease-in-out',
    '&:hover': {
      transform: 'scale(1.01)',

      // TODO
      // Increase elevation on hover.
    },
    paddingBottom: 270, // handle the space taken by the ad
  },
  achievement: {
    width: 360,
    margin: theme.spacing(1),
    position: 'relative',
    zIndex: 100, // greater than the timeline bar
  },
  achievementBadge: {
    margin: theme.spacing(1),
    flex: 0,
    position: 'relative',
    zIndex: 100, // greater than the timeline bar
  },
  timelineBar: {
    position: 'absolute',
    zIndex: 10, // less than the achievements
    height: '100%',
    top: 40,
    width: 18,
    background: grey['300'],
  },
  centerContainer: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 220, // for visually-appealing vertical centering
  },
  searchBarContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 500,
    maxWidth: 800,
  },
  searchBar: {
    position: 'relative',
    zIndex: 1e4, // must be higher than all content besides ads and modal
    margin: theme.spacing(1),
  },
  logo: {
    height: 50,
    margin: theme.spacing(0.5),
    boxSizing: 'content-box',
    position: 'relative',
    zIndex: 1e4, // same as search bar
    pointerEvents: 'none',
  },
  supportingChip: {
    position: 'relative',
    zIndex: 1e4, // same as search bar
    margin: theme.spacing(0.5),
    alignSelf: 'center',
  },
  adsContainer: {
    position: 'absolute',
    zIndex: 1e5, // must be on top of all content
    overflow: 'visible',
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'row-reverse', // swap to move ads to opposite side
    bottom: 0,
    right: 0,
    left: 0,
    pointerEvents: 'none', // don't block the main page
  },
  adsContainerRectangles: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    pointerEvents: 'all', // needs to be clickable
    margin: 10,
  },
  adContainerLeaderboard: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'visible',
    marginBottom: 10,
    pointerEvents: 'all', // needs to be clickable
  },
  notificationTitle: {
    fontWeight: '700',
    fontSize: '24px',
  },
  notificationText: {
    marginBottom: theme.spacing(2),
  },

  // TODO: create reusable new button
  notificationButton: {
    background: '#29BEBA',
    borderRadius: '15px',
    height: '30px',
    '&:hover': {
      background: '#00a097',
    },
    fontWeight: '900',
    marginLeft: theme.spacing(1),
    color: 'white',
  },
}))

if (isClientSide()) {
  // Load ads immediately on the client side when we parse
  // this file rather than waiting for component mount.
  const loadAds = () => {
    try {
      const setGAMDevKey = isGAMDevEnvironment()
      fetchAds({
        adUnits: Object.values(getAdUnits()),
        pageLevelKeyValues: {
          v4: 'true',
          causeId: localStorageMgr.getCauseForGAM(),
          ...(setGAMDevKey && { dev: 'true' }),
        },
        auctionTimeout: 1000,
        bidderTimeout: 700,
        consent: {
          enabled: true,

          // Time to wait for the consent management platform (CMP) to respond.
          // If the CMP does not respond in this time, ad auctions may be cancelled.
          // The tab-cmp package aims to make the CMP respond much more quickly
          // than this after the user's first page load.
          timeout: 500,
        },
        publisher: {
          domain: getHostname(),
          pageUrl: getCurrentURL(),
        },
        logLevel: 'error',
        onError: (e) => {
          logger.error(e)
        },
        disableAds: !areAdsEnabled(),
        useMockAds: showMockAds(),
      })
    } catch (e) {
      logger.error(e)
    }
  }
  loadAds()
}

const getRelayQuery = async ({ AuthUser }) => {
  // If the user is not authenticated, don't try to fetch data
  // for this page. We won't render the page until data exists.
  if (!AuthUser.id) {
    return {}
  }
  return {
    query: graphql`
      query pagesIndexQuery($userId: String!) {
        app {
          ...MoneyRaisedContainer_app
          ...SearchInputContainer_app
        }
        user(userId: $userId) {
          id
          email
          hasViewedIntroFlow
          tabs
          vcCurrent
          joined
          showYahooPrompt
          showSfacExtensionPrompt
          cause {
            causeId
            impactType
            impactVisits
            landingPagePath
            name
            onboarding {
              steps {
                title
                subtitle
                imgName
              }
            }
            # Theme data is required for CustomThemeHOC.
            theme {
              primaryColor
              secondaryColor
            }
          }
          currentMission {
            status
            tabGoal
            tabCount
            missionId
          }
          features {
            featureName
            variation
          }
          notifications {
            code
          }
          searches
          showSfacIcon
          ...MoneyRaisedContainer_user
          ...UserBackgroundImageContainer_user
          ...UserImpactContainer_user
          ...InviteFriendsIconContainer_user
          ...SocialShareContainer_user
          ...EmailInviteDialogContainer_user
          ...SearchInputContainer_user
          ...SfacActivityContainer_user
        }
      }
    `,
    variables: {
      userId: AuthUser.id,
      charityId: CAT_CHARITY,
    },
  }
}

const Index = ({ data: fallbackData, userAgent }) => {
  const { data, isDataFresh } = useData({
    getRelayQuery,
    fallbackData,

    // If we are using the service worker (serving a cached version
    // of the page HTML), fetch fresh data on mount.
    ...(process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED === 'true' && {
      revalidateOnMount: true,
    }),
  })

  const showAchievements = showMockAchievements()
  const enableBackgroundImages = showBackgroundImages()

  // Determine which ad units we'll show only once, on mount,
  // because the ads have already been fetched and won't change.
  const [adUnits, setAdUnits] = useState([])
  useEffect(() => {
    setAdUnits(getAdUnits())
  }, [])

  // Only render ads if we are on the client side.
  const [shouldRenderAds, setShouldRenderAds] = useState(false)
  useEffect(() => {
    if (isClientSide()) {
      setShouldRenderAds(true)
    }
  }, [])
  const { app, user, userImpact } = data || {}
  const {
    id: userId,
    currentMission,
    email,
    features = [],
    cause,
    joined,
    notifications = [],
    showYahooPrompt,
    showSfacExtensionPrompt,
    searches,
    showSfacIcon,
  } = user || {}
  const {
    theme,
    onboarding,
    causeId,
    impactType,
    name: causeName,
  } = cause || {}
  const { primaryColor, secondaryColor } = theme || {}

  const growthbook = useGrowthBook()

  // Set features in local storage
  useEffect(() => {
    localStorageFeaturesManager.setFeatures(features)
  }, [features])

  // Set Growthbook attributes when the user is defined.
  useEffect(() => {
    if (userId) {
      const attributesObject = {
        id: userId,
        env: process.env.NEXT_PUBLIC_GROWTHBOOK_ENV,
        causeId,
        v4BetaEnabled: true,
        joined,
        isTabTeamMember: showInternalOnly(email),
      }
      validateAttributesObject(userId, attributesObject)
      growthbook.setAttributes(attributesObject)
    }
  }, [causeId, email, growthbook, joined, userId])

  // Set the theme based on cause.
  const setTheme = useCustomTheming()
  useEffect(
    () => setTheme({ primaryColor, secondaryColor }),
    [setTheme, primaryColor, secondaryColor]
  )

  const {
    status: missionStatus = 'not started',
    tabCount,
    tabGoal,
    missionId,
  } = currentMission || {}
  const userGlobalId = get(user, 'id')
  const globalTabCount = get(user, 'tabs')
  const [tabId] = useState(uuid())

  const classes = useStyles()

  // this is a temporary workaround as the latest updates to the
  // relay store do not push into this component, so we are manually
  // toggling state and a rerender when we successfully fire the
  // SetHasViewedIntroFlowMutation
  const [justFinishedIntroFlow, setJustFinishedIntroFlow] = useState(false)

  const [showSFACSellModalMode, setShowSFACSellModalMode] = useState(null)
  const onSearchSelectMoreInfoClick = () => {
    setShowSFACSellModalMode('hard-sell')
  }
  const [showSearchInputTooltip, setSearchInputTooltip] = useState(false)
  const [showSFACNotification, setShowSFACNotification] = useState(false)
  const [shouldShowSfacExtensionPrompt, setShouldShowSfacExtensionPrompt] =
    useState(false)

  // Determine if we should show the SFAC extension prompt.
  const searchExtensionSupported = useDoesBrowserSupportSearchExtension({
    userAgent,
  })
  const browser = useBrowserName({
    userAgent,
  })
  const searchActivityNotificationSupported =
    isSearchActivityComponentSupported(browser)
  useEffect(() => {
    // Only show the prompt if:
    // * The browser has a SFAC extension
    // * We have fetched fresh data on whether to show the prompt. Otherwise,
    //   we might show the prompt based on service worker -cached data that
    //   hasn't yet updated since the user interacted.
    if (searchExtensionSupported && isDataFresh) {
      setShouldShowSfacExtensionPrompt(showSfacExtensionPrompt)
    }
  }, [searchExtensionSupported, showSfacExtensionPrompt, isDataFresh])

  // Determine if we should show the SFAC on-tab search info message.
  const [interactedWithSFACNotification, setInteractedWithSFACNotification] =
    useState(true)
  const onSFACSellModalAccept = () => {
    setSearchInputTooltip(
      'Great! You can always switch your search engine here later on.'
    )
    setShowSFACNotification(false)
    setInteractedWithSFACNotification(false)
  }
  const onSearchInputClick = useCallback(() => {
    setShowSFACNotification(showYahooPrompt && interactedWithSFACNotification)

    // get feature, set tooltip if correct
    const v2ExperimentVariation = getFeatureValue(
      features,
      YAHOO_SEARCH_NEW_USERS_V2
    )
    if (
      v2ExperimentVariation === 'Tooltip' &&
      searches === 0 &&
      !localStorageMgr.getItem(HAS_SEEN_SEARCH_V2_TOOLTIP)
    ) {
      localStorageMgr.setItem(HAS_SEEN_SEARCH_V2_TOOLTIP, true)
      setSearchInputTooltip('You can switch your search engine here.')
    }
  }, [showYahooPrompt, interactedWithSFACNotification, features, searches])

  // set the causeId in local storage for tab ads
  useEffect(() => {
    localStorageMgr.setItem(STORAGE_NEW_USER_CAUSE_ID, causeId)
  }, [causeId])

  // log tab count when user first visits
  useEffect(() => {
    if (userGlobalId && tabId) {
      LogTabMutation(userGlobalId, tabId)

      // Update today's tab count in localStorage.
      // This is useful when making rendering decisions before
      // we fetch user data from the server (e.g., whether we
      // should show ads or not).
      incrementTabsOpenedToday()

      if (impactType === CAUSE_IMPACT_TYPES.individual) {
        // this might seem confusing.  Right now we handle logging mission impact in the log tab mutation
        // but we use update impact to update v4 impact if a user is not in a mission
        // in the future we should handle both mission impact and individual v4 impact
        // inside the update impact mutation
        if (missionStatus === 'not started' || missionStatus === 'pending') {
          UpdateImpactMutation(userGlobalId, {
            logImpact: true,
          })
        }
      }
      newTabView()
    }
  }, [userGlobalId, tabId, missionStatus, impactType])

  // log reddit and fbook event if first visit
  useEffect(() => {
    if (globalTabCount === 0) {
      accountCreated()
    }
  }, [globalTabCount])

  // Show a one-off notification.
  const NOTIFICATION_ID = '1.5Mraised' // edit as needed
  const notifLocalStorageKey = `${NOTIF_DISMISS_PREFIX}${NOTIFICATION_ID}`
  const [showCustomNotification, setShowCustomNotification] = useState(false)
  useEffect(() => {
    if (
      isClientSide() &&
      localStorageMgr.getItem(notifLocalStorageKey) !== 'true' &&
      isDataFresh && // avoid flickering stale content
      !!notifications.find((notif) => notif.code === NOTIFICATION_ID)
    ) {
      setShowCustomNotification(true)
    }
  }, [notifications, isDataFresh, notifLocalStorageKey])
  const onNotificationClose = () => {
    localStorageMgr.setItem(notifLocalStorageKey, 'true')
    setShowCustomNotification(false)
  }

  // Don't load the page until there is data. Data won't exist
  // if the user doesn't have auth cookies and thus doesn't fetch
  // any data server-side, in which case we'll fetch data in
  // `useData` above.
  if (!data) {
    return <FullPageLoader />
  }

  // Determine if we should show mission content.
  const missionsFeatureEnabled = showDevelopmentOnlyMissionsFeature(email)

  // Data to provide the onAdDisplayed callback
  const adContext = {
    user,
    tabId,
  }

  /*
   * A handler for AdComponents' onAdDisplayed callbacks, which receives
   * info about the displayed ad.
   * @param {Object|null} displayedAdInfo - A DisplayedAdInfo from tab-ads. See:
   *   https://github.com/gladly-team/tab-ads/blob/master/src/utils/DisplayedAdInfo.js
   * @param {Object} context - Additional info to help with revenue logging
   * @param {Object} context.user - The user object
   * @param {String} context.user.id - The user ID
   * @param {String} context.tabId - A UUID for this page load
   * @return {undefined}
   */
  const onAdDisplayed = (displayedAdInfo, context) => {
    // No ad was shown.
    if (!displayedAdInfo) {
      return
    }

    const { revenue, encodedRevenue, GAMAdvertiserId, GAMAdUnitId, adSize } =
      displayedAdInfo

    // Log the revenue from the ad.
    LogUserRevenueMutation({
      userId: context.user.id,
      revenue,
      ...(encodedRevenue && {
        encodedRevenue: {
          encodingType: 'AMAZON_CPM',
          encodedValue: encodedRevenue,
        },
      }),
      dfpAdvertiserId: GAMAdvertiserId.toString(),
      adSize,

      // Only send aggregationOperation value if we have more than one
      // revenue value
      aggregationOperation:
        !isNil(revenue) && !isNil(encodedRevenue) ? 'MAX' : null,
      tabId: context.tabId,
      adUnitCode: GAMAdUnitId,
    })
  }

  /*
   * Log any errors the occur in the Ad components.
   * @param {Object} e - The error
   * @return {undefined}
   */
  const onAdError = (e) => {
    logger.error(e)
  }

  const onCompletedOnboarding = async () => {
    await SetHasViewedIntroFlowMutation({ enabled: true, userId: userGlobalId })
    setJustFinishedIntroFlow(true)
  }
  const showIntro = !get(user, 'hasViewedIntroFlow') && !justFinishedIntroFlow
  return (
    <div className={classes.pageContainer} data-test-id="new-tab-page">
      {showIntro ? (
        <div className={classes.OnboardingFlow}>
          <div
            style={{
              padding: '20px 40px',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <Logo style={{ height: 40 }} includeText causeId={causeId} />
          </div>
          <OnboardingFlow
            onComplete={onCompletedOnboarding}
            showMissionSlide={!!missionId}
            onboarding={onboarding}
          />
        </div>
      ) : (
        <>
          {enableBackgroundImages ? (
            <UserBackgroundImageContainer user={user} />
          ) : null}
          <div className={classes.fullContainer}>
            <div className={classes.topContainer}>
              <div className={classes.topRightContainer}>
                <div className={classes.userMenuContainer}>
                  {missionsFeatureEnabled ? (
                    <MissionHubButton status={missionStatus} />
                  ) : (
                    <InviteFriendsIconContainer user={user} />
                  )}
                  {missionsFeatureEnabled &&
                  (missionStatus === 'started' ||
                    missionStatus === 'completed') ? (
                    <SquadCounter
                      progress={Math.floor((tabCount / tabGoal) * 100)}
                    />
                  ) : null}
                  {userGlobalId ? (
                    <SearchForACauseSellModal
                      userId={userGlobalId}
                      hardSell={showSFACSellModalMode === 'hard-sell'}
                      open={showSFACSellModalMode !== null}
                      onAccept={onSFACSellModalAccept}
                      onClose={() => setShowSFACSellModalMode(null)}
                    />
                  ) : null}
                  {showSfacIcon && searchActivityNotificationSupported ? (
                    <SfacActivityContainer user={user} />
                  ) : null}
                  {impactType === CAUSE_IMPACT_TYPES.individual ? (
                    <UserImpactContainer
                      userId={userGlobalId}
                      userImpact={userImpact}
                      user={user}
                      disabled={
                        missionsFeatureEnabled &&
                        (missionStatus === 'started' ||
                          missionStatus === 'completed')
                      }
                    />
                  ) : (
                    <Link to={aboutURL}>
                      <IconButton>
                        <InfoIcon
                          className={clsx(
                            classes.userMenuItem,
                            classes.settingsIcon
                          )}
                        />
                      </IconButton>
                    </Link>
                  )}
                  <div className={classes.moneyRaisedContainer}>
                    <Typography
                      variant="h5"
                      className={clsx(classes.userMenuItem)}
                    >
                      {growthbook.feature('test-feature').value ? (
                        <p>Welcome to our site!</p>
                      ) : null}
                      <MoneyRaisedContainer app={app} user={user} />
                    </Typography>
                  </div>
                  <div className={classes.settingsIconContainer}>
                    <Link to={accountURL}>
                      <IconButton>
                        <SettingsIcon
                          className={clsx(
                            classes.userMenuItem,
                            classes.settingsIcon
                          )}
                        />
                      </IconButton>
                    </Link>
                  </div>
                </div>
                {/**
                 * TODO: consolidate all notifications here to manage
                 * visible state. Right now, these will overlay the ones
                 * that appear via the UserImpact component.
                 */}
                <div className={classes.notificationsContainer}>
                  {showCustomNotification ? (
                    <Notification
                      className={classes.notification}
                      text={
                        <div className={classes.notificationText}>
                          <Typography
                            variant="h2"
                            gutterBottom
                            className={classes.notificationTitle}
                          >
                            $1.5M raised!
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            Tabbers have now raised over $1,500,000 for charity!
                            It's amazing what a dedicated community and a few
                            (million) browser tabs can do :)
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            See what we've accomplished together:
                          </Typography>
                        </div>
                      }
                      buttons={
                        <div className={classes.notificationButtonsWrapper}>
                          <Link
                            to={ONE_AND_A_HALF_MILLION_RAISED_URL}
                            target="_blank"
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              className={classes.notificationButton}
                            >
                              Check it out
                            </Button>
                          </Link>
                        </div>
                      }
                      includeClose
                      onClose={onNotificationClose}
                    />
                  ) : null}
                  {userGlobalId && shouldShowSfacExtensionPrompt ? (
                    <SfacExtensionSellNotification
                      userId={userGlobalId}
                      browser={browser}
                    />
                  ) : null}
                  {userGlobalId && showSFACNotification ? (
                    <SearchForACauseSellNotification
                      userId={userGlobalId}
                      onLearnMore={() => setShowSFACSellModalMode('normal')}
                      onNoThanks={() => setShowSFACSellModalMode('hard-sell')}
                      onSwitchToSearchForACause={() =>
                        setSearchInputTooltip(
                          'Great! You can always switch your search engine here later on.'
                        )
                      }
                    />
                  ) : null}
                </div>
              </div>
            </div>
            {showAchievements ? (
              <Link
                to={achievementsURL}
                className={classes.achievementsContainer}
                data-test-id="achievements"
              >
                <Achievement
                  className={classes.achievement}
                  impactText="Plant 1 tree"
                  status="inProgress"
                  taskText="Open tabs 5 days in a row"
                  deadlineTime={dayjs().add(3, 'days').toISOString()}
                  progress={{
                    currentNumber: 2,
                    targetNumber: 5,
                    visualizationType: 'checkmarks',
                  }}
                />
                <Achievement
                  badgeClassName={classes.achievementBadge}
                  badgeOnly
                  impactText="Plant 1 tree"
                  status="failure"
                  taskText="Recruit 1 friend"
                  completedTime={dayjs().subtract(2, 'days').toISOString()}
                  deadlineTime={dayjs().subtract(2, 'days').toISOString()}
                />
                <Achievement
                  badgeClassName={classes.achievementBadge}
                  badgeOnly
                  impactText="Plant 1 tree"
                  status="success"
                  taskText="Open 100 tabs"
                  completedTime={dayjs().subtract(5, 'days').toISOString()}
                  deadlineTime={dayjs().subtract(5, 'days').toISOString()}
                />
                <div /> {/* take up a spacing unit */}
                <div className={classes.timelineBar} />
              </Link>
            ) : null}
          </div>
          <div className={classes.centerContainer}>
            <div className={classes.searchBarContainer}>
              <Logo
                includeText
                color={enableBackgroundImages ? 'white' : null}
                className={classes.logo}
              />
              <Chip
                label={`Supporting: ${causeName}`}
                className={classes.supportingChip}
                color="primary"
                size="small"
                onClick={() => {
                  goTo(aboutURL)
                }}
              />
              <SearchInputContainer
                userId={userId}
                className={classes.searchBar}
                app={app}
                user={user}
                onSearchSelectMoreInfoClick={onSearchSelectMoreInfoClick}
                onSearchInputClick={onSearchInputClick}
                tooltip={showSearchInputTooltip}
              />
            </div>
          </div>
          <div className={classes.adsContainer}>
            <div className={classes.adsContainerRectangles}>
              {adUnits.rectangleAdSecondary && shouldRenderAds ? (
                <AdComponent
                  adId={adUnits.rectangleAdSecondary.adId}
                  onAdDisplayed={(displayedAdInfo) => {
                    onAdDisplayed(displayedAdInfo, adContext)
                  }}
                  onError={onAdError}
                  style={{
                    display: 'flex',
                    minWidth: 300,
                    overflow: 'visible',
                  }}
                />
              ) : null}
              {adUnits.rectangleAdPrimary && shouldRenderAds ? (
                <AdComponent
                  adId={adUnits.rectangleAdPrimary.adId}
                  onAdDisplayed={(displayedAdInfo) => {
                    onAdDisplayed(displayedAdInfo, adContext)
                  }}
                  onError={onAdError}
                  style={{
                    display: 'flex',
                    minWidth: 300,
                    overflow: 'visible',
                    marginTop: 10,
                  }}
                />
              ) : null}
            </div>
            {adUnits.leaderboard && shouldRenderAds ? (
              <div className={classes.adContainerLeaderboard}>
                <AdComponent
                  adId={adUnits.leaderboard.adId}
                  onAdDisplayed={(displayedAdInfo) => {
                    onAdDisplayed(displayedAdInfo, adContext)
                  }}
                  onError={onAdError}
                  style={{
                    overflow: 'visible',
                    minWidth: 728,
                  }}
                />
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}

Index.displayName = 'Index'

Index.propTypes = {
  data: PropTypes.shape({
    app: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({
      cause: PropTypes.shape({
        causeId: PropTypes.string.isRequired,
        impactType: PropTypes.string.isRequired,
        impactVisits: PropTypes.number,
        landingPagePath: PropTypes.string,
        name: PropTypes.string.isRequired,
        theme: PropTypes.shape({
          primaryColor: PropTypes.string.isRequired,
          secondaryColor: PropTypes.string.isRequired,
        }),
      }).isRequired,
      features: PropTypes.arrayOf(
        PropTypes.shape({
          featureName: PropTypes.string.isRequired,

          // Allow any type for experiment variations.
          // eslint-disable-next-line react/forbid-prop-types
          variation: PropTypes.any,
        })
      ).isRequired,
      hasViewedIntroFlow: PropTypes.bool.isRequired,
      joined: PropTypes.string.isRequired,
      tabs: PropTypes.number.isRequired,
      vcCurrent: PropTypes.number.isRequired,
      showYahooPrompt: PropTypes.bool,
      showSfacExtensionPrompt: PropTypes.bool,
    }).isRequired,
  }),
  userAgent: PropTypes.string,
}

Index.defaultProps = {
  data: null,
  userAgent: undefined,
}

// We have a top level Catch Boundary because sentry is not handling
// uncaught exceptions as expected.  You can see the unsolved issue
// here: https://github.com/vercel/next.js/issues/1852.
// withSentrySSR sets the user in our logger so that errors passed to
// the top level catch pass user data to sentry.
export const getServerSideProps = flowRight([
  logUncaughtErrors,
  withAuthUserTokenSSR({
    whenUnauthed: AuthAction.SHOW_LOADER,
    LoaderComponent: FullPageLoader,
  }),
  withSentrySSR,
  withDataSSR(getRelayQuery),
  () => async (ctx) => {
    const userAgent = get(ctx, 'req.headers["user-agent"]')
    return {
      props: {
        userAgent,
      },
    }
  },
])()

export default flowRight([
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    LoaderComponent: FullPageLoader,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withSentry,
  withRelay,
  withGoogleAnalyticsProperties,
  CustomThemeHOC,
])(Index)
