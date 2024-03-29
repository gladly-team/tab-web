import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { makeStyles } from '@material-ui/core/styles'
import { getReferralUrl } from 'src/utils/urls'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import SocialShareContainer from './SocialShareContainer'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyIcon: {
    color: theme.palette.text.secondary,
  },
}))

const InviteFriends = ({ user }) => {
  const {
    username,
    cause: { landingPagePath },
  } = user
  const classes = useStyles()
  const referralUrl = getReferralUrl(username, landingPagePath)
  const textFieldRef = React.createRef()

  const highlightReferralUrl = () => {
    textFieldRef.current.select()
    // eslint-disable-next-line no-undef
    document.execCommand('copy')
  }

  return (
    <div className={classes.root}>
      <TextField
        id="refer-friend-input"
        inputRef={textFieldRef}
        value={referralUrl}
        onClick={highlightReferralUrl}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={highlightReferralUrl}>
                <FileCopyIcon className={classes.copyIcon} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <SocialShareContainer url={referralUrl} iconSize={24} user={user} />
    </div>
  )
}

InviteFriends.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    cause: PropTypes.shape({
      landingPagePath: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default InviteFriends
