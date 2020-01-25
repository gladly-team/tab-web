// A composed HOC helper for a set of page wrappers where the page:
// - requires authentication
// - passes the AuthUserInfo as a prop to the wrapped component
// - fetches data via Relay

import { flow } from 'lodash/util'
import authRequired from 'src/utils/pageWrappers/authRequired'
import withAuthUserInfo from 'src/utils/pageWrappers/withAuthUserInfo'
import withData from 'src/utils/pageWrappers/withData'

export default getRelayQuery =>
  // Invokes from left to right.
  flow(withAuthUserInfo, authRequired, withData(getRelayQuery))
