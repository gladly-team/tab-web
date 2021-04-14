import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import Typography from '@material-ui/core/Typography'
import DashboardPopover from 'src/components/DashboardPopover'
import { get } from 'lodash/object'
import InviteFriends from 'src/components/InviteFriends'

const useStyles = makeStyles((theme) => ({
  copyIcon: {
    color: theme.palette.text.secondary,
  },
  topLevel: {
    marginRight: '11px',
  },
  friendsIcon: {
    height: 28,
    width: 28,
    color: get(theme, 'palette.backgroundContrastText.main'),
  },
  titleSection: {
    marginBottom: '10px',
  },
  popover: { marginTop: '4px' },
  popoverContent: {
    padding: 12,
    width: 402,
  },
}))

const InviteFriendsIcon = ({ user: { username } }) => {
  const buttonRef = useRef(undefined)
  const [isPopoverOpen, setIsPopoverOpen] = useState()
  const classes = useStyles()

  return (
    <>
      <IconButton
        className={classes.topLevel}
        ref={buttonRef}
        onClick={() => setIsPopoverOpen(true)}
      >
        <GroupAddIcon className={classes.friendsIcon} />
      </IconButton>
      <DashboardPopover
        open={isPopoverOpen}
        anchorEl={buttonRef.current}
        onClose={() => {
          setIsPopoverOpen(false)
        }}
        className={classes.popover}
      >
        <div className={classes.popoverContent}>
          <Typography className={classes.titleSection}>
            helping cats feels even better with friends
          </Typography>
          <Typography gutterBottom variant="body2">
            Invite a friend! When they join, you'll each earn 5 treats to give
            to shelter cats:
          </Typography>
          <InviteFriends
            user={{ username }}
            className={classes.InviteFriends}
          />
        </div>
      </DashboardPopover>
    </>
  )
}

InviteFriendsIcon.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    numUsersRecruited: PropTypes.number,
  }),
}

InviteFriendsIcon.defaultProps = {
  user: {
    username: '',
    numUsersRecruited: 0,
  },
}

export default InviteFriendsIcon
