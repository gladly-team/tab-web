import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Notification from 'src/components/Notification'
import { Typography } from '@material-ui/core'
import SquadInviteResponseMutation from 'src/utils/mutations/SquadInviteResponseMutation'
import UpdateMissionNotificationMutation from 'src/utils/mutations/UpdateMissionNotificationMutation'
import { MISSION_STARTED, MISSION_COMPLETE } from 'src/utils/constants'
import { makeStyles } from '@material-ui/core/styles'
import { goTo } from 'src/utils/navigation'
import { missionHubURL } from 'src/utils/urls'

const DISPLAY_MISSION_STARTED = 'mission_started'
const DISPLAY_MISSION_COMPLETED = 'mission_completed'
const DISPLAY_MISSION_INVITE = 'mission_invite'

const useStyles = makeStyles(() => ({
  bold: {
    fontWeight: 'bold',
  },
}))

const MissionNotification = ({
  userId,
  currentMission: {
    status,
    acknowledgedMissionComplete,
    acknowledgedMissionStarted: acknowledgedMissionStart,
    missionId: currentMissionId,
  },
  pendingMissionInvites,
}) => {
  const [open, setOpen] = useState(true)

  const acceptSquadInvite = (missionId) => {
    SquadInviteResponseMutation(userId, missionId, true)
    setOpen(false)
  }

  const rejectSquadInvite = (missionId) => {
    SquadInviteResponseMutation(userId, missionId, false)
    setOpen(false)
  }

  const acknowledgedMissionStarted = (missionId) => {
    UpdateMissionNotificationMutation(userId, missionId, MISSION_STARTED)
    goTo(missionHubURL)
  }

  const acknowledgedMissionCompleted = (missionId) => {
    UpdateMissionNotificationMutation(userId, missionId, MISSION_COMPLETE)
    goTo(missionHubURL)
  }

  const classes = useStyles()
  let display = null
  if (status !== 'pending' && !acknowledgedMissionStart) {
    display = DISPLAY_MISSION_STARTED
  } else if (status !== 'completed' && acknowledgedMissionComplete) {
    display = DISPLAY_MISSION_COMPLETED
  } else if (pendingMissionInvites && pendingMissionInvites.length > 0) {
    display = DISPLAY_MISSION_INVITE
  }

  switch (display) {
    case DISPLAY_MISSION_INVITE: {
      const invite = pendingMissionInvites[0]
      return (
        <Notification
          open={open}
          text={
            <div>
              <Typography variant="body2" className={classes.bold} gutterBottom>
                You got a Squad Invite!
              </Typography>
              <Typography variant="body2" gutterBottom>
                {invite.invitingUser.name} sent you an invite to join their
                Squad! Would you like to join them?
              </Typography>
              <Typography variant="body2" gutterBottom>
                With Squads, you and your friends raise money together to give a
                training session to a shelter cat. This helps them get adopted
                more quickly!
              </Typography>
            </div>
          }
          buttonText="Accept"
          buttonOnClick={() => acceptSquadInvite(invite.missionId)}
          includeSecondaryButton
          secondaryButtonText="Reject"
          secondaryButtonOnClick={() => rejectSquadInvite(invite.missionId)}
        />
      )
    }
    case DISPLAY_MISSION_STARTED:
      return (
        <Notification
          open={open}
          text={
            <div>
              <Typography variant="body2" className={classes.bold} gutterBottom>
                Your mission has started!
              </Typography>
              <Typography variant="body2" gutterBottom>
                Your friend invited you on their mission! You can track how your
                Squad is doing in the Mission Hub.
              </Typography>
            </div>
          }
          buttonText="View Details"
          buttonOnClick={() => acknowledgedMissionStarted(currentMissionId)}
        />
      )
    case DISPLAY_MISSION_COMPLETED:
      return (
        <Notification
          open={open}
          text={
            <div>
              <Typography variant="body2" className={classes.bold} gutterBottom>
                Mission Completed!
              </Typography>
              <Typography variant="body2" gutterBottom>
                Your Squad has completed it’s mission! Together you’ve raised
                enough to give a shelter cat a full training session, helping
                them get adopted sooner!
              </Typography>
            </div>
          }
          buttonText="View Details"
          buttonOnClick={() => acknowledgedMissionCompleted(currentMissionId)}
        />
      )
    default:
      return null
  }
}

MissionNotification.displayName = 'MissionNotification'
MissionNotification.propTypes = {
  userId: PropTypes.string.isRequired,
  currentMission: PropTypes.shape({
    missionId: PropTypes.string,
    status: PropTypes.string,
    acknowledgedMissionComplete: PropTypes.bool,
    acknowledgedMissionStarted: PropTypes.bool,
  }),
  pendingMissionInvites: PropTypes.arrayOf(
    PropTypes.shape({
      missionId: PropTypes.string,
      invitingUser: PropTypes.string,
    })
  ),
}

MissionNotification.defaultProps = {
  currentMission: null,
  pendingMissionInvites: [],
}
export default MissionNotification
