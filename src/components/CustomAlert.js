import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import DoneIcon from '@material-ui/icons/Done'
import Typography from '@material-ui/core/Typography'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import SquadInviteResponseMutation from 'src/utils/mutations/SquadInviteResponseMutation'
import { goTo } from 'src/utils/navigation'
import { missionHubURL } from 'src/utils/urls'
import Button from '@material-ui/core/Button'
import clsx from 'clsx'

const customAlertUseStyles = makeStyles((theme) => ({
  wrapper: {
    borderRadius: '4px',
    minHeight: '32px',
    border: `1px solid`,
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.background,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
  },
  missionCompleteWrapper: {
    width: '100%',
  },
  text: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    fontSize: '14px',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  buttonContainer: { margin: theme.spacing(3), marginLeft: 'auto' },
}))
const CustomAlert = ({ text, icon, missionId, id }) => {
  const acceptSquadInvite = async () => {
    await SquadInviteResponseMutation(id, missionId, true)
    goTo(missionHubURL)
  }
  const rejectSquadInvite = () => {
    SquadInviteResponseMutation(id, missionId, false)
    goTo(missionHubURL)
  }
  const cx = customAlertUseStyles()
  return (
    <div className={clsx(cx.wrapper, missionId && cx.missionCompleteWrapper)}>
      {icon === 'done' && <DoneIcon color="primary" />}
      {icon === 'star' && <StarBorderIcon color="primary" />}
      {icon === 'message' && <MailOutlineIcon color="primary" />}
      <Typography classes={{ root: cx.text }}>{text}</Typography>
      {missionId && (
        <div className={cx.buttonContainer}>
          <Button
            style={{ marginRight: '8px' }}
            variant="outlined"
            color="primary"
            onClick={rejectSquadInvite}
          >
            Decline
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={acceptSquadInvite}
          >
            Accept
          </Button>
        </div>
      )}
    </div>
  )
}

CustomAlert.displayName = 'CustomAlert'
CustomAlert.propTypes = {
  /**
    the icon to show, can be done or star
  */
  icon: PropTypes.oneOf(['star', 'done', 'message']),

  /**
    the text to show
  */
  text: PropTypes.string.isRequired,

  /**
    mission Id to rejoin a squad, triggers two buttons
  */
  missionId: PropTypes.string,

  /**
    user id
  */
  id: PropTypes.string,
}
CustomAlert.defaultProps = {
  icon: 'star',
  missionId: null,
  id: null,
}
export default CustomAlert
