import * as Sentry from '@sentry/node'
import { get } from 'lodash/object'
import {
  CUSTOM_REQ_DATA_KEY,
  AUTH_USER_KEY,
} from 'src/utils/middleware/constants'

const setSentryUser = (handler) => async (req, res) => {
  const AuthUser = get(req, [CUSTOM_REQ_DATA_KEY, AUTH_USER_KEY], {})
  const { id, email } = AuthUser
  if (id && email) {
    Sentry.setUser({ id, email })
  }
  return handler(req, res)
}
export default setSentryUser
