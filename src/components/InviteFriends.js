import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { makeStyles } from '@material-ui/core/styles'
import { getReferralUrl } from 'src/utils/urls'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'

const useStyles = makeStyles((theme) => ({
  copyIcon: {
    color: theme.palette.text.secondary,
  },
}))

const InviteFriends = ({ user: { username } }) => {
  const classes = useStyles()
  const referralUrl = getReferralUrl(username)
  const textFieldRef = React.createRef()

  const highlightReferralUrl = () => {
    textFieldRef.current.select()
    // eslint-disable-next-line no-undef
    document.execCommand('copy')
  }

  return (
    <>
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
    </>
  )
}

InviteFriends.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
  }),
}

InviteFriends.defaultProps = {
  user: {},
}

export default InviteFriends
