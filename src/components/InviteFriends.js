import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  copyIcon: {
    color: theme.palette.text.secondary,
  },
}))

const InviteFriends = ({ baseURL, user: { username } }) => {
  const classes = useStyles()
  const getReferralUrl = () => {
    const referralUrl = username
      ? `${baseURL}/?u=${encodeURIComponent(username)}`
      : baseURL
    return referralUrl
  }

  const referralUrl = getReferralUrl()
  const textFieldRef = React.createRef()

  const highlightReferralUrl = () => {
    textFieldRef.current.select()
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
