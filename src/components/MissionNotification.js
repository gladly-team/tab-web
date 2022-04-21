import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Notification from 'src/components/Notification'
import { Typography } from '@material-ui/core'
import SquadInviteResponseMutation from 'src/utils/mutations/SquadInviteResponseMutation'
import UpdateMissionNotificationMutation from 'src/utils/mutations/UpdateMissionNotificationMutation'
import { MISSION_STARTED } from 'src/utils/constants'
import { makeStyles } from '@material-ui/core/styles'
import { goTo } from 'src/utils/navigation'
import { missionHubURL } from 'src/utils/urls'
import SetHasSeenCompletedMissionMutation from 'src/utils/mutations/SetHasSeenCompletedMissionMutation'

const DISPLAY_MISSION_STARTED = 'mission_started'
const DISPLAY_MISSION_COMPLETED = 'mission_completed'
const DISPLAY_MISSION_INVITE = 'mission_invite'

const useStyles = makeStyles(() => ({
  bold: {
    fontWeight: 'bold',
  },
  notification: {
    position: 'absolute',
    marginTop: '10px',
    marginRight: '15px',
  },
}))

const MissionNotification = ({
  userId,
  currentMission,
  pendingMissionInvites,
}) => {
  const {
    status,
    acknowledgedMissionComplete,
    acknowledgedMissionStarted: acknowledgedMissionStart,
    missionId: currentMissionId,
  } = currentMission || {}
  const [open, setOpen] = useState(true)

  const acceptSquadInvite = async (missionId) => {
    await SquadInviteResponseMutation(userId, missionId, true)
    goTo(missionHubURL)
  }

  const rejectSquadInvite = (missionId) => {
    SquadInviteResponseMutation(userId, missionId, false)
    setOpen(false)
  }

  const acknowledgedMissionStarted = (missionId) => {
    UpdateMissionNotificationMutation(userId, missionId, MISSION_STARTED)
    goTo(missionHubURL)
  }

  const classes = useStyles()
  let display = null
  if (status === 'started' && !acknowledgedMissionStart) {
    display = DISPLAY_MISSION_STARTED
  } else if (status === 'completed' && !acknowledgedMissionComplete) {
    display = DISPLAY_MISSION_COMPLETED
  } else if (
    status !== 'pending' &&
    pendingMissionInvites &&
    pendingMissionInvites.length > 0
  ) {
    display = DISPLAY_MISSION_INVITE
  }

  switch (display) {
    case DISPLAY_MISSION_INVITE: {
      const invite = pendingMissionInvites[0]
      return (
        <Notification
          className={classes.notification}
          open={open}
          text={
            <div>
              <Typography variant="body2" className={classes.bold} gutterBottom>
                You got a squad invite!
              </Typography>
              <Typography variant="body2" gutterBottom>
                {invite.invitingUser.name} sent you an invite to join their
                squad! Would you like to join them?
              </Typography>
              <Typography variant="body2" gutterBottom>
                With squads, you and your friends raise money together to give a
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
          className={classes.notification}
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
          includeClose
          onClose={() => {
            UpdateMissionNotificationMutation(
              userId,
              currentMissionId,
              MISSION_STARTED
            )
            setOpen(false)
          }}
        />
      )
    case DISPLAY_MISSION_COMPLETED:
      return (
        <Notification
          className={classes.notification}
          open={open}
          text={
            <div>
              <Typography variant="body2" className={classes.bold} gutterBottom>
                Mission Completed!
              </Typography>
              <Typography variant="body2" gutterBottom>
                Your squad has completed it’s mission! Together you’ve raised
                enough to give a shelter cat a full training session, helping
                them get adopted sooner!
              </Typography>
            </div>
          }
          buttonText="View Details"
          buttonOnClick={() => {
            // if acknowledged go to mission hub where completed mission is shown then set as viewed after
            goTo(missionHubURL)
          }}
          includeClose
          onClose={() => {
            // if dismissed, move completed mission to past missions
            SetHasSeenCompletedMissionMutation(userId, currentMissionId)
            setOpen(false)
          }}
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
      invitingUser: PropTypes.shape({ name: PropTypes.string }),
    })
  ),
}

MissionNotification.defaultProps = {
  currentMission: null,
  pendingMissionInvites: [],
}
export default MissionNotification
