import React from 'react'
import PropTypes from 'prop-types'
import { LANDING_PAGE_PATH_SEAS } from 'src/utils/constants'
import UserImpactCats from './UserImpactCats'
import UserImpactSeas from './UserImpactSeas'

const UserImpactSwitchComponent = ({ user, disabled }) => {
  const { cause: { landingPagePath } = {} } = user
  switch (landingPagePath) {
    case LANDING_PAGE_PATH_SEAS: {
      return <UserImpactSeas {...{ user, disabled }} />
    }
    default: {
      return <UserImpactCats {...{ user, disabled }} />
    }
  }
}
UserImpactSwitchComponent.displayName = 'UserImpactSwitchComponent'
UserImpactSwitchComponent.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    notifications: PropTypes.arrayOf(
      PropTypes.shape({ code: PropTypes.string })
    ),
    userImpact: PropTypes.shape({
      visitsUntilNextImpact: PropTypes.number.isRequired,
      pendingUserReferralImpact: PropTypes.number.isRequired,
      pendingUserReferralCount: PropTypes.number.isRequired,
      userImpactMetric: PropTypes.number.isRequired,
      confirmedImpact: PropTypes.bool.isRequired,
      hasClaimedLatestReward: PropTypes.bool.isRequired,
    }).isRequired,
    cause: PropTypes.shape({ landingPagePath: PropTypes.string }),
    currentMission: PropTypes.shape({
      missionId: PropTypes.string,
    }),
    pendingMissionInvites: PropTypes.arrayOf(
      PropTypes.shape({
        invitingUser: PropTypes.shape({ name: PropTypes.string }),
        missionId: PropTypes.string,
      })
    ),
    hasSeenSquads: PropTypes.bool,
    email: PropTypes.string,
  }).isRequired,
  disabled: PropTypes.bool.isRequired,
}

UserImpactSwitchComponent.defaultProps = {}
export default UserImpactSwitchComponent
