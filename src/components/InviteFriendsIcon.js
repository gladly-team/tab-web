import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import { get } from 'lodash/object'
import EmailInviteDialog from 'src/components/EmailInviteDialog'
import Dialog from '@material-ui/core/Dialog'

const useStyles = makeStyles((theme) => ({
  copyIcon: {
    color: theme.palette.text.secondary,
  },
  topLevel: {
    marginRight: '11px',
  },
  rootModal: { zIndex: '10000000 !important', borderRadius: '5px' },
  customMaxWidthDialog: { maxWidth: '512px' },
  friendsIcon: {
    height: 28,
    width: 28,
    color: get(theme, 'palette.backgroundContrastText.main'),
  },
  titleSection: {
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  popover: { marginTop: '4px' },
  popoverContent: {
    padding: 12,
    width: 402,
  },
}))

const InviteFriendsIcon = ({
  user: {
    username,
    id,
    cause: { landingPagePath },
  },
}) => {
  const buttonRef = useRef(undefined)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const classes = useStyles()
  const closeDialog = () => setIsDialogOpen(false)
  return (
    <>
      <IconButton
        className={classes.topLevel}
        ref={buttonRef}
        onClick={() => setIsDialogOpen(true)}
      >
        <GroupAddIcon className={classes.friendsIcon} />
      </IconButton>
      <Dialog
        maxWidth="sm"
        classes={{ paperWidthSm: classes.customMaxWidthDialog }}
        fullWidth
        onClose={closeDialog}
        aria-labelledby="customized-dialog-title"
        open={isDialogOpen}
        className={classes.rootModal}
      >
        <EmailInviteDialog
          username={username}
          userId={id}
          landingPagePath={landingPagePath}
          closeFunction={closeDialog}
        />
      </Dialog>
    </>
  )
}

InviteFriendsIcon.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.string,
    numUsersRecruited: PropTypes.number,
    cause: PropTypes.shape({
      landingPagePath: PropTypes.string.isRequired,
    }).isRequired,
  }),
}

InviteFriendsIcon.defaultProps = {
  user: {
    username: '',
    id: PropTypes.string,
    numUsersRecruited: 0,
  },
}

export default InviteFriendsIcon
