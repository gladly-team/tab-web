import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { makeStyles } from '@material-ui/core/styles'
import { getReferralUrl } from 'src/utils/urls'

const useStyles = makeStyles((theme) => ({
  copyIcon: {
    color: theme.palette.text.secondary,
  },
}))

const InviteFriends = ({ baseURL, user: { username } }) => {
  const classes = useStyles()
  const referralUrl = getReferralUrl(baseURL, username)
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
      />
      <FileCopyIcon
        className={classes.copyIcon}
        onClick={highlightReferralUrl}
      />
    </>
  )
}

InviteFriends.propTypes = {
  baseURL: PropTypes.string,
  user: PropTypes.shape({
    username: PropTypes.string,
  }),
}

InviteFriends.defaultProps = {
  baseURL: 'https://tab.gladly.io',
  user: {},
}

export default InviteFriends
