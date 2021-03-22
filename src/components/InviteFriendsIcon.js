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
  friendsIcon: {
    height: 32,
    width: 32,
    color: get(theme, 'palette.backgroundContrastText.main'),
  },
  titleSection: {
    marginBottom: '10px',
  },
  popover: { marginTop: 9 },
  popoverContent: {
    padding: 12,
    width: 402,
  },
}))

const InviteFriendsIcon = ({ user: { username, numUsersRecruited } }) => {
  const buttonRef = useRef(undefined)
  const [isPopoverOpen, setIsPopoverOpen] = useState()
  const classes = useStyles()

  return (
    <>
      <IconButton ref={buttonRef} onClick={() => setIsPopoverOpen(true)}>
        <GroupAddIcon className={classes.friendsIcon} />
      </IconButton>
      <DashboardPopover
        open={isPopoverOpen}
        anchorEl={buttonRef.current}
        onClose={() => {
          setIsPopoverOpen(false)
        }}
      >
        <div className={classes.popoverContent}>
          <Typography className={classes.titleSection}>
            You've recruited{' '}
            <span style={{ fontWeight: 'bold' }}>
              {`${numUsersRecruited} friend${
                numUsersRecruited > 1 ? 's' : ''
              } `}
            </span>{' '}
          </Typography>
          <Typography variant="body2">
            invite a friend! When they join, you'll earn a treat for 10 shelter
            cats:
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
