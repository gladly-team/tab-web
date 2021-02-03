// libraries
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { flowRight } from 'lodash/util'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { graphql } from 'react-relay'
import { AdComponent, fetchAds } from 'tab-ads'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
// custom components
import Achievement from 'src/components/Achievement'
import Link from 'src/components/Link'
import Logo from 'src/components/Logo'
import MoneyRaisedContainer from 'src/components/MoneyRaisedContainer'
import UserBackgroundImageContainer from 'src/components/UserBackgroundImageContainer'
import SearchInput from 'src/components/SearchInput'
// material components
import { makeStyles, ThemeProvider } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import SettingsIcon from '@material-ui/icons/Settings'
// utils
import withDataSSR from 'src/utils/pageWrappers/withDataSSR'
import withRelay from 'src/utils/pageWrappers/withRelay'
import { getHostname, getCurrentURL } from 'src/utils/navigation'
import {
  getAdUnits,
  areAdsEnabled,
  showMockAds,
  isInEuropeanUnion,
} from 'src/utils/adHelpers'
import { isClientSide } from 'src/utils/ssr'
import { accountURL, achievementsURL } from 'src/utils/urls'
import {
  showMockAchievements,
  showBackgroundImages,
} from 'src/utils/featureFlags'
import logger from 'src/utils/logger'
import FullPageLoader from 'src/components/FullPageLoader'
import useData from 'src/utils/hooks/useData'
import { extendTheme } from 'src/utils/theme'
import BackgroundImageActiveTheme from 'src/utils/styles/backgroundImageActiveTheme'

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    height: '100vh',
    width: '100vw',
    background: theme.palette.background.paper,
    overflow: 'hidden',
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'flex-start',
  },
  userMenuContainer: {
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(0),
  },
  moneyRaisedContainer: {
    margin: theme.spacing(0.5),
  },
  settingsIconContainer: {
    margin: theme.spacing(0.5),
  },
  settingsIcon: {
    height: 20,
    width: 20,
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
    zIndex: 1e4, // must be higher than all content besides ads
  },
  logo: {
    height: 50,
    padding: theme.spacing(2),
    boxSizing: 'content-box',
    position: 'relative',
    zIndex: 1e4, // same as search bar
    pointerEvents: 'none',
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
}))

if (isClientSide()) {
  // Load ads immediately on the client side when we parse
  // this file rather than waiting for component mount.
  const loadAds = () => {
    try {
      fetchAds({
        adUnits: Object.values(getAdUnits()),
        auctionTimeout: 1200,
        bidderTimeout: 900,
        consent: {
          isEU: isInEuropeanUnion,
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
        }
        user(userId: $userId) {
          tabs
          vcCurrent
          ...UserBackgroundImageContainer_user
        }
      }
    `,
    variables: {
      userId: AuthUser.id,
    },
  }
}

const Index = ({ data: initialData }) => {
  const classes = useStyles()

  // FIXME: this query is executing more than once. Most likely,
  // the SWR key is changing in `useData` (possbly due to its
  // use of shallow equality).
  const { data } = useData({
    getRelayQuery,
    initialData,
    // If we are using the service worker (serving a cached version
    // of the page HTML), fetch fresh data on mount.
    revalidateOnMount:
      process.env.NEXT_PUBLIC_SERVICE_WORKER_ENABLED === 'true',
  })
  const showAchievements = showMockAchievements()
  const enableBackgroundImages = showBackgroundImages()
  const extendedTheme =
    enableBackgroundImages === true ? BackgroundImageActiveTheme : {}
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

  // Don't load the page until there is data. Data won't exist
  // if the user doesn't have auth cookies and thus doesn't fetch
  // any data server-side, in which case we'll fetch data in
  // `useData` above.
  if (!data) {
    return <FullPageLoader />
  }
  const { app, user } = data

  // FIXME: use UUID in state
  const tabId = 'abc-123'

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
    console.log('Ad displayed:', displayedAdInfo, context) // eslint-disable-line no-console
  }

  /*
   * Log any errors the occur in the Ad components.
   * @param {Object} e - The error
   * @return {undefined}
   */
  const onAdError = (e) => {
    logger.error(e)
  }

  return (
    <div className={classes.pageContainer} data-test-id="new-tab-page">
      {enableBackgroundImages ? (
        <UserBackgroundImageContainer user={user} />
      ) : null}
      <div className={classes.fullContainer}>
        <div className={classes.topContainer}>
          <ThemeProvider theme={(theme) => extendTheme(theme, extendedTheme)}>
            <div className={classes.userMenuContainer}>
              <div className={classes.moneyRaisedContainer}>
                <Typography variant="h5" className={clsx(classes.userMenuItem)}>
                  <MoneyRaisedContainer app={app} />
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
          </ThemeProvider>
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
          <Logo includeText className={classes.logo} />
          <SearchInput className={classes.searchBar} />
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
    </div>
  )
}

Index.displayName = 'Index'

Index.propTypes = {
  data: PropTypes.shape({
    app: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({
      tabs: PropTypes.number.isRequired,
      vcCurrent: PropTypes.number.isRequired,
    }).isRequired,
  }),
}

Index.defaultProps = {
  data: null,
}

export const getServerSideProps = flowRight([
  withAuthUserTokenSSR({
    whenUnauthed: AuthAction.SHOW_LOADER,
    LoaderComponent: FullPageLoader,
  }),
  withDataSSR(getRelayQuery),
])()

export default flowRight([
  withAuthUser({
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    LoaderComponent: FullPageLoader,
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  }),
  withRelay,
])(Index)
