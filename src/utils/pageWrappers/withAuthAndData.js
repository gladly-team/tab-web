// A composed HOC helper for a set of page wrappers where the page:
// - requires authentication
// - passes the AuthUserInfo as a prop to the wrapped component
// - fetches data via Relay

import { flowRight } from 'lodash/util'
import withData from 'src/utils/pageWrappers/withData'

// TODO: use next-firebase-auth

const withAuthAndData = (getRelayQuery) =>
  // FIXME
  // Invokes from left to right.
  flowRight(withData(getRelayQuery))

export default withAuthAndData
