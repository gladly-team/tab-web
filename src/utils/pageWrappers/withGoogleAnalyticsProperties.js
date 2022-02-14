import React, { useEffect } from 'react'
import { useAuthUser } from 'next-firebase-auth'
import gtag from 'src/utils/google-analytics'

// A component wrapper that sets Google Analytics properties.
// This should be wrapped in `withAuthUser`.
const withGoogleAnalyticsProperties = (ChildComponent) => {
  const WithGAPropsHOC = (props) => {
    const AuthUser = useAuthUser()
    const { id: userId } = AuthUser || {}
    useEffect(() => {
      // Set Google Analytics values to include on all events.
      // https://developers.google.com/tag-platform/gtagjs/reference#set
      // https://support.google.com/analytics/answer/11396839
      gtag('set', 'user_properties', {
        ...(userId && {
          tfac_user_id: userId,
        }),
      })
    }, [userId])
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <ChildComponent {...props} />
  }

  WithGAPropsHOC.displayName = 'WithGAPropsHOC'
  return WithGAPropsHOC
}

export default withGoogleAnalyticsProperties
