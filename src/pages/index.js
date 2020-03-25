import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-relay'
import { get } from 'lodash/object'
import { AdComponent, fetchAds } from 'tab-ads'
import withAuthAndData from 'src/utils/pageWrappers/withAuthAndData'
import Link from 'src/components/Link'
import { authURL, exampleURL } from 'src/utils/urls'
import logout from 'src/utils/auth/logout'
import { getHostname, getCurrentURL } from 'src/utils/navigation'
import {
  getAdUnits,
  areAdsEnabled,
  showMockAds,
  isInEuropeanUnion,
} from 'src/utils/adHelpers'
import { isClientSide } from 'src/utils/ssr'

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
        logLevel: 'debug',
        onError: e => {
          // TODO: log error
          console.error(e) // eslint-disable-line no-console
        },
        disableAds: !areAdsEnabled(),
        useMockAds: showMockAds(),
      })
    } catch (e) {
      // TODO: log error
      console.error(e) // eslint-disable-line no-console
    }
  }
  loadAds()
}

const Index = props => {
  const { AuthUserInfo, app, user } = props
  const AuthUser = get(AuthUserInfo, 'AuthUser', null)
  const { moneyRaised } = app
  const { tabs, vcCurrent } = user
  const onLogout = async () => {
    try {
      await logout()
    } catch (e) {
      // TODO: log error
      console.error(e) // eslint-disable-line no-console
    }
  }

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
  const onAdError = e => {
    // TODO: log error
    console.error(e) // eslint-disable-line no-console
  }

  return (
    <div>
      <p>Hi there!</p>
      {!AuthUser ? (
        <div>
          <p>
            You are not signed in.{' '}
            <Link to={authURL}>
              <a>Sign in</a>
            </Link>
          </p>
        </div>
      ) : (
        <div>
          <p>You're signed in. Email: {AuthUser.email}</p>
          <button type="button" onClick={onLogout}>
            Log out
          </button>
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <Link to={exampleURL}>
          <a>Another example page</a>
        </Link>
      </div>
      <div style={{ marginTop: 20 }}>
        <div>Money raised: {moneyRaised}</div>
        <div>Tabs: {tabs}</div>
        <div>Hearts: {vcCurrent}</div>
      </div>
      <div style={{ marginTop: 20 }}>
        <p>
          This page shares data with the{' '}
          <a href="/newtab/">current new tab page</a>.
        </p>
      </div>
      {/* TODO: use classes for styling */}
      <div
        data-test-id="ads-container"
        style={{
          position: 'absolute',
          overflow: 'visible',
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: 'row-reverse',
          bottom: 10,
          right: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'visible',
          }}
        >
          {adUnits.rectangleAdSecondary && shouldRenderAds ? (
            <AdComponent
              adId={adUnits.rectangleAdSecondary.adId}
              onAdDisplayed={displayedAdInfo => {
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
              onAdDisplayed={displayedAdInfo => {
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'visible',
              marginRight: 10,
            }}
          >
            <AdComponent
              adId={adUnits.leaderboard.adId}
              onAdDisplayed={displayedAdInfo => {
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
  AuthUserInfo: PropTypes.shape({
    AuthUser: PropTypes.shape({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      emailVerified: PropTypes.bool.isRequired,
    }),
    token: PropTypes.string,
  }),
  app: PropTypes.shape({
    moneyRaised: PropTypes.number.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    tabs: PropTypes.number.isRequired,
    vcCurrent: PropTypes.number.isRequired,
  }).isRequired,
}

Index.defaultProps = {
  AuthUserInfo: null,
}

export default withAuthAndData(({ AuthUser }) => {
  const userId = get(AuthUser, 'id')
  return {
    query: graphql`
      query pagesIndexQuery($userId: String!) {
        app {
          moneyRaised
        }
        user(userId: $userId) {
          tabs
          vcCurrent
        }
      }
    `,
    variables: {
      userId,
    },
  }
})(Index)
