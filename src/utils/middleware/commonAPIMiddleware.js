import addUserFromAuthorizationToken from 'src/utils/middleware/addUserFromAuthorizationToken'
import authProtected from 'src/utils/middleware/authProtected'
import customHeaderRequired from 'src/utils/middleware/customHeaderRequired'
import onlyPostRequests from 'src/utils/middleware/onlyPostRequests'

export default (handler) =>
  onlyPostRequests(
    customHeaderRequired(addUserFromAuthorizationToken(authProtected(handler)))
  )
