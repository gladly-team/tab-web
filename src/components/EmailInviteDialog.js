/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { makeStyles } from '@material-ui/core/styles'
import { getReferralUrl } from 'src/utils/urls'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import MuiDialogContent from '@material-ui/core/DialogContent'
import SocialShare from 'src/components/SocialShare'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import CreateInvitedUsersMutation from 'src/utils/mutations/CreateInvitedUsersMutation'
import shareCats from 'src/assets/images/shareCats.png'
import catsSent from 'src/assets/images/catsSent.png'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'
import Fade from '@material-ui/core/Fade'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContentRoot: {
    padding: theme.spacing(4),
  },
  titleText: {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '2rem',
    marginTop: theme.spacing(0.5),
  },
  purpleColor: {
    color: theme.palette.text.primary,
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
    height: theme.spacing(6),
    backgroundColor: theme.palette.colors.purple1,
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
  copyIcon: {
    color: theme.palette.text.secondary,
  },
  socialShare: {
    display: 'flex',
    flexDirection: 'column',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(1),
    minHeight: '332px',
    justifyContent: 'space-evenly',
  },
}))

// simple subnav for larger dialog
const TabPanel = (props) => {
  const { children, value, index } = props

  return (
    <div
      style={{ marginTop: '8px' }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {children}
    </div>
  )
}
TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

const EmailInviteFriendsDialog = ({ username, userId, closeFunction }) => {
  const classes = useStyles()
  const [value, setValue] = React.useState(0)
  const [emailInput, setEmailInputChange] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [validEmails, setValidEmails] = useState([])
  const [name, setName] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')
  const [personalMessageError, setPersonalMessageError] = useState(false)
  const [sendingState, setSendingState] = useState('Send Invite')
  const referralUrl = getReferralUrl(username)
  const textFieldRef = React.createRef()

  const highlightReferralUrl = () => {
    textFieldRef.current.select()
    // eslint-disable-next-line no-undef
    document.execCommand('copy')
  }

  const setChange = (event, newValue) => {
    setValue(newValue)
  }
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
    await CreateInvitedUsersMutation(userId, validEmails, name, personalMessage)
    setSendingState('invitations sent! ✅')
    setValidEmails([])
    setTimeout(() => {
      setSendingState('Send Invite')
      setPersonalMessage('')
      setName('')
    }, 2500)
  }
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
  return (
    <div className={classes.root}>
      <MuiDialogContent classes={{ root: classes.dialogContentRoot }}>
        {/* MuiDialog modifies the padding on the 1st child and i cant override it so adding this style */}
        <img src={shareCats} alt="cats" style={{ marginTop: '12px' }} />
        <IconButton
          onClick={closeFunction}
          style={{ position: 'absolute', right: '16px', top: '20px' }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" classes={{ h4: classes.titleText }}>
          Share Tab for Cats with your friends
        </Typography>
        <Typography style={{ marginBottom: '8px' }}>
          Save more cats! When a friend signs up, you'll each earn 5 additional
          treats to help a shelter cat get adopted. 😺
        </Typography>
        <Tabs value={value} onChange={setChange} indicatorColor="primary">
          <Tab label="Email" />
          <Tab label="Social Media" />
        </Tabs>
        <TabPanel value={value} index={0}>
          {sendingState !== 'invitations sent! ✅' ? (
            <div>
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
                  !isValidEmail
                    ? 'oops.  It looks like this email address is incorrect!'
                    : validEmails.length >= 20
                    ? 'you can send 20 emails at a time'
                    : "add your friend's email"
                }
                variant="outlined"
                onChange={emailInputOnChange}
                onBlur={onEmailBlur}
                onKeyDown={onEmailEnterKey}
              />

              <div className={classes.chipContainer}>
                {validEmails.map((item) => (
                  <Fade in key={item}>
                    <Chip
                      size="small"
                      classes={{
                        deleteIconSmall: classes.chipDelete,
                        root: classes.chip,
                      }}
                      label={item}
                      key={item}
                      onDelete={() => deleteEmail(item)}
                    />
                  </Fade>
                ))}
              </div>
              <TextField
                fullWidth
                value={name}
                size="small"
                label="Your name"
                helperText="Enter your name"
                variant="outlined"
                onChange={(event) => setName(event.target.value)}
              />
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
                    ? 'the max length of the personal message is 160 characters'
                    : 'Let your friend know why they should join.'
                }
                variant="outlined"
                error={personalMessageError}
                onChange={personalMessageValidateAndSet}
              />
            </div>
          ) : (
            <Fade in>
              <div className={classes.sentBox}>
                <img src={catsSent} height="120px" width="240px" alt="cats2" />
                <Typography color="primary" variant="h4">
                  Thanks for sharing!
                </Typography>
              </div>
            </Fade>
          )}
          <Button
            className={classes.sendButton}
            fullWidth
            variant="contained"
            color="primary"
            onClick={sendEmailInvites}
            disabled={
              !(validEmails.length && name.length) || personalMessageError
            }
          >
            {sendingState}
          </Button>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div className={classes.socialShare}>
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
                      <FileCopyIcon className={classes.copyIcon} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography color="primary" variant="caption">
                Share to social media
              </Typography>
              <SocialShare url={referralUrl} iconSize={60} />
            </div>
          </div>
        </TabPanel>
      </MuiDialogContent>
    </div>
  )
}

EmailInviteFriendsDialog.propTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  closeFunction: PropTypes.func.isRequired,
}

EmailInviteFriendsDialog.defaultProps = {}

export default EmailInviteFriendsDialog
