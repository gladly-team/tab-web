import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

import Chip from '@material-ui/core/Chip'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button'
import catsSent from 'src/assets/images/catsSent.png'
import TextField from '@material-ui/core/TextField'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { getSquadsLink } from 'src/utils/urls'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import CreateSquadInvitesMutation from 'src/utils/mutations/CreateSquadInvitesMutation'
import logger from 'src/utils/logger'

const useStyles = makeStyles((theme) => ({
  copyIcon: {
    color: theme.palette.text.secondary,
  },
  socialShare: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    justifyContent: 'space-evenly',
    minWidth: '460px',
  },
  psuedoLabel: {
    color: theme.palette.primary.main,
    fontSize: '12px',
    marginBottom: theme.spacing(1),
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: '40px',
    maxHeight: '90px',
    overflowY: 'auto',
  },
  sendButton: {
    marginTop: theme.spacing(2),
  },
  sentBox: {
    display: 'flex',
    flexDirection: 'column',
    height: '260px',
    alignItems: 'center',
    paddingTop: theme.spacing(4),
  },
  chip: {
    margin: theme.spacing(0.5),
    backgroundColor: theme.palette.primary.background,
  },
  chipDelete: {
    color: theme.palette.primary.main,
  },
  customSeparator: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    '&::before': {
      content: '""',
      flex: 1,
      borderBottom: `2px solid rgba(0, 0, 0, 0.12)`,
    },
    '&::after': {
      content: '""',
      flex: 1,
      borderBottom: `2px solid rgba(0, 0, 0, 0.12)`,
    },
    '&:not(:empty)::before': {
      marginRight: '.25em',
    },
    '&:not(:empty)::after': {
      marginLeft: '.25em',
    },
  },
}))
const MissionSocialShare = ({ emailSentCallback, missionId, user }) => {
  const cx = useStyles()
  const [emailInput, setEmailInputChange] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [validEmails, setValidEmails] = useState([])
  const [name, setName] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')
  const [personalMessageError, setPersonalMessageError] = useState(false)
  const [sendingState, setSendingState] = useState('Send Invite')
  const { username, id } = user || {}

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const addEmail = () => {
    const isValid = validateEmail(emailInput)
    if (isValid) {
      setValidEmails((prevState) => prevState.concat([emailInput]))
      setEmailInputChange('')
    } else {
      setIsValidEmail(false)
    }
  }
  const emailInputOnChange = (event) => {
    setEmailInputChange(event.target.value)
    if (!isValidEmail) {
      setIsValidEmail(validateEmail(event.target.value))
    }
  }
  const sendEmailInvites = async () => {
    setSendingState('sending...')
    try {
      const {
        createSquadInvites: { currentMission: newCurrentMission },
      } = await CreateSquadInvitesMutation(
        id,
        validEmails,
        name,
        personalMessage
      )
      setSendingState('invitations sent! ✅')
      setValidEmails([])
      setTimeout(() => {
        setSendingState('Send Invite')
        setPersonalMessage('')
        setName('')
        emailSentCallback(newCurrentMission)
      }, 2500)
    } catch (e) {
      logger.error(e)
    }
  }
  const referralUrl = getSquadsLink(username, missionId)
  const textFieldRef = useRef(null)
  const onEmailBlur = () => (emailInput !== '' ? addEmail() : null)
  const onEmailEnterKey = (e) => (e.key === 'Enter' ? addEmail() : null)
  const deleteEmail = (email) => {
    const filteredEmails = validEmails.filter((item) => item !== email)
    setValidEmails(filteredEmails)
  }
  const personalMessageValidateAndSet = (e) => {
    setPersonalMessage(e.target.value)
    if (e.target.value.length > 160) {
      setPersonalMessageError(true)
    } else if (personalMessageError) {
      setPersonalMessageError(false)
    }
  }
  const highlightReferralUrl = () => {
    textFieldRef.current.select()
    try {
      // eslint-disable-next-line no-undef
      document.execCommand('copy')

      // "execCommand isn't supported by all browsers, but we're fine with it failing silently."
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
  return (
    <div className={cx.socialShare}>
      {' '}
      <TextField
        id="refer-friend-input"
        inputRef={textFieldRef}
        value={referralUrl}
        label="Send a link"
        focused
        onClick={highlightReferralUrl}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={highlightReferralUrl}>
                <FileCopyIcon className={cx.copyIcon} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <div className={cx.customSeparator}>
        <Typography>or</Typography>
      </div>
      {sendingState !== 'invitations sent! ✅' ? (
        <>
          <Typography className={cx.psuedoLabel}>
            Send email invites.
          </Typography>
          <TextField
            fullWidth
            value={name}
            size="small"
            label="Your name"
            helperText="Let your friend know who's inviting them."
            variant="outlined"
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            style={{ marginTop: '8px' }}
            fullWidth
            size="small"
            disabled={validEmails.length >= 20}
            error={!isValidEmail}
            id="recipientsInput"
            value={emailInput}
            label="Recipients"
            helperText={
              // eslint-disable-next-line no-nested-ternary
              !isValidEmail
                ? 'Oops.  It looks like this email address is incorrect!'
                : validEmails.length >= 20
                ? 'You can send 20 emails at a time.'
                : "Add your friend's email."
            }
            variant="outlined"
            onChange={emailInputOnChange}
            onBlur={onEmailBlur}
            onKeyDown={onEmailEnterKey}
          />
          <div className={cx.chipContainer}>
            {validEmails.map((item) => (
              <Fade in key={item}>
                <Chip
                  size="small"
                  classes={{
                    deleteIconSmall: cx.chipDelete,
                    root: cx.chip,
                  }}
                  label={item}
                  key={item}
                  onDelete={() => deleteEmail(item)}
                />
              </Fade>
            ))}
          </div>
          <TextField
            style={{ marginTop: '12px' }}
            fullWidth
            size="small"
            value={personalMessage}
            label="Message"
            multiline
            rows={2}
            helperText={
              personalMessageError
                ? 'The max length of the personal message is 160 characters.'
                : 'Let your friend know why they should join.'
            }
            variant="outlined"
            error={personalMessageError}
            onChange={personalMessageValidateAndSet}
          />
        </>
      ) : (
        <Fade in>
          <div className={cx.sentBox}>
            <img src={catsSent} height="120px" width="240px" alt="cats2" />
            <Typography color="primary" variant="h4">
              Thanks {name}! Your invites were sent.
            </Typography>
          </div>
        </Fade>
      )}
      <Button
        className={cx.sendButton}
        fullWidth
        variant="contained"
        color="primary"
        onClick={sendEmailInvites}
        disabled={!(validEmails.length && name.length) || personalMessageError}
      >
        {sendingState}
      </Button>
    </div>
  )
}
MissionSocialShare.displayName = 'MissionSocialShare'
MissionSocialShare.propTypes = {
  /**
    the username and user id nested in a user object
  */
  user: PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,

  /**
    the mission id to put in the referral link and email
  */
  missionId: PropTypes.string,

  /**
    callback to be invoked when CreateSquadInvitesMutation returns
  */
  emailSentCallback: PropTypes.func.isRequired,
}
MissionSocialShare.defaultProps = {
  missionId: '',
}
export default MissionSocialShare
