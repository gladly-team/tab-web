import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash/object'
import TextField from '@material-ui/core/TextField'

const InviteFriends = (props) => {
  const getReferralUrl = () => {
    const { baseURL, user } = props
    const username = get(user, 'username')
    const referralUrl = username
      ? `${baseURL}/?u=${encodeURIComponent(username)}`
      : baseURL
    return referralUrl
  }

  const { label } = props
  const referralUrl = getReferralUrl()
  const textFieldRef = React.createRef()

  const highlightReferralUrl = () => {
    textFieldRef.current.select()
  }

  return (
    <TextField
      id="refer-friend-input"
      inputRef={textFieldRef}
      onClick={highlightReferralUrl}
      value={referralUrl}
      label={label}
    />
  )
}

InviteFriends.propTypes = {
  baseURL: PropTypes.string,
  user: PropTypes.shape({
    username: PropTypes.string,
  }),
  label: PropTypes.string,
}

InviteFriends.defaultProps = {
  baseURL: 'https://tab.gladly.io',
  user: {},
  label: 'Share this link',
}

export default InviteFriends
