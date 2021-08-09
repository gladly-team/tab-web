import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import AddIcon from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography'
import Accordion from '@material-ui/core/Accordion'
import LinearProgress from '@material-ui/core/LinearProgress'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import Chip from '@material-ui/core/Chip'
import Fade from '@material-ui/core/Fade'
import Table from '@material-ui/core/Table'
import Button from '@material-ui/core/Button'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import squadsStep1 from 'src/assets/images/squadsStep1.png'
import squadsStep2 from 'src/assets/images/squadsStep2.png'
import squadsStep3 from 'src/assets/images/squadsStep3.png'
import catsSent from 'src/assets/images/catsSent.png'
import TextField from '@material-ui/core/TextField'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import { getSquadsLink } from 'src/utils/urls'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import CreateSquadInvitesMutation from 'src/utils/mutations/CreateSquadInvitesMutation'
import CreateNewMissionMutation from 'src/utils/mutations/CreateNewMissionMutation'

const useStyles = makeStyles((theme) => ({
  topContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  titleFont: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  subtitleFont: {
    fontSize: '16px',
    color: theme.palette.colors.subtitleGrey,
  },
  hr: {
    marginLeft: 0,
    marginRight: 0,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    width: '100%',
  },
  alertIcon: { flexDirection: 'column', justifyContent: 'center' },
  alertRoot: {
    margin: '0px 40px',
    position: 'absolute',
    top: '80px',
    left: 0,
    right: 0,
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      top: '10px',
      margin: '0px 10px',
    },
  },
  explanationCardContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    minWidth: '90%',
    alignSelf: 'center',
    marginTop: theme.spacing(3.5),
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
  },
  explanationCard: {
    display: 'flex',
    flexDirection: 'column',
    width: '250px',
    alignItems: 'center',
  },
  captionFont: {
    fontSize: '12px',
    color: theme.palette.colors.subtitleGrey,
  },
  progressBar: {
    width: `calc(100% - ${theme.spacing(6)}px)`,
  },
  progressBarContainer: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(4),
    width: '100%',
  },
  startedContainer: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  table: { border: '1px solid rgba(224, 224, 224, 1)' },
  tableHead: {
    fontWeight: 'bold',
  },
  tableDisabled: {
    color: theme.palette.colors.disabledGrey,
  },
  addSquadMateButton: {
    alignSelf: 'flex-end',
    display: 'flex',
    marginTop: theme.spacing(4),
    alignItems: 'center',
    cursor: 'pointer',
  },
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
    height: theme.spacing(3),
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
const customAlertUseStyles = makeStyles((theme) => ({
  wrapper: {
    borderRadius: '4px',
    minHeight: '32px',
    border: `1px solid`,
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.background,
    display: 'flex',
    alignItems: 'center',
  },
  text: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    fontSize: '14px',
    marginLeft: theme.spacing(2),
  },
}))
const CustomAlert = ({ text }) => {
  const cx = customAlertUseStyles()
  return (
    <div className={cx.wrapper}>
      <StarBorderIcon color="primary" />
      <Typography classes={{ root: cx.text }}>{text}</Typography>
    </div>
  )
}
const CurrentMissionComponent = ({ user }) => {
  const cx = useStyles()
  const [expanded, setExpanded] = useState(false)
  const [isAddSquadMateOpen, setIsAddSquadMateOpen] = useState(false)
  const [squadName, setSquadName] = useState('')
  const [emailInput, setEmailInputChange] = useState('')
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [validEmails, setValidEmails] = useState([])
  const [name, setName] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')
  const [personalMessageError, setPersonalMessageError] = useState(false)
  const [createSquadButton, setCreateSquadButton] = useState('next')
  const [sendingState, setSendingState] = useState('Send Invite')
  const [currentMission, setCurrentMission] = useState(
    (user || {}).currentMission || {}
  )
  console.log(currentMission)
  useEffect(() => {
    if (user) {
      setCurrentMission(user.currentMission)
    }
  }, [user])
  const addSquadMatesSection = useRef(null)
  const { username, id } = user || {}
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }
  const handleAddSquadMateClick = () => {
    setIsAddSquadMateOpen(!isAddSquadMateOpen)
    // eslint-disable-next-line no-undef
    if (isAddSquadMateOpen === false) {
      window.scrollTo({
        left: 0,
        top: addSquadMatesSection.current.offsetTop - 216,
        behavior: 'smooth',
      })
    }
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
    const {
      createSquadInvites: { currentMission: newCurrentMission },
    } = await CreateSquadInvitesMutation(id, validEmails, name, personalMessage)
    setSendingState('invitations sent! ✅')
    setValidEmails([])
    setTimeout(() => {
      setSendingState('Send Invite')
      setPersonalMessage('')
      setName('')
      setCurrentMission(newCurrentMission)
    }, 2500)
  }
  const createSquad = async () => {
    const {
      createNewMission: { currentMission: newCurrentMission },
    } = await CreateNewMissionMutation(id, squadName)
    setCurrentMission(newCurrentMission)
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

  const { tabCount = 0, tabGoal = 1000, missionId, squadMembers = [], status } =
    currentMission || {}
  const referralUrl = getSquadsLink(username, missionId)
  const textFieldRef = useRef(null)
  console.log(currentMission, 'current missions')
  const createTableData = (squadMembers) =>
    squadMembers.reduce((tableData, member) => {
      const {
        status: userStatus,
        invitedEmail,
        username: squadUserName,
        tabs = 0,
        streak = 0,
        tabsToday = 0,
      } = member
      const pivotedMemberData = {
        userStatus,
        user:
          userStatus === 'accepted'
            ? squadUserName
            : `${invitedEmail || squadUserName} (awaiting response)`,
        tabsToday,
        tabs,
        streak,
        contribution: `${Math.round((tabs / tabCount) * 100)}%`,
      }
      tableData.push(pivotedMemberData)
      return tableData
    }, [])
  const highlightReferralUrl = () => {
    textFieldRef.current.select()
    try {
      // eslint-disable-next-line no-undef
      document.execCommand('copy')
    } catch (e) {}
  }
  const tableData = createTableData(squadMembers)
  const renderSocialShare = () => (
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
  return (
    <Paper elevation={1} className={cx.topContainer}>
      <div>
        <Typography classes={{ root: cx.titleFont }}>Your Squad</Typography>
        <Accordion
          elevation={0}
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={cx.subtitleFont}>
              A mission lets you work together with friends to help get a
              shelter cat adopted! When you work together with your squad you
              can make a larger impact, sooner. read more
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className={cx.subtitleFont}>
              Every tab you open supports cats in need. Squads enables you to
              team up with friends and earn more treats together. Cats can get
              adopted up to 3x faster with Squads! You can create your first
              squad today, just start with a couple invites below!
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <hr className={cx.hr} />
      <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
        New Mission
      </Typography>
      {status && (
        <div style={{ display: 'flex' }}>
          <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Status:{' '}
          </Typography>
          <Typography style={{ fontSize: '16px', marginLeft: '8px' }}>
            {status}
          </Typography>
        </div>
      )}
      <div style={{ marginTop: '16px' }}>
        <CustomAlert text="Team up with your friends and help give a shelter cat a new home and family!" />
      </div>
      <div className={cx.explanationCardContainer}>
        <div className={cx.explanationCard}>
          <img
            src={squadsStep1}
            alt="squad step 1"
            height="180px"
            width="250px"
          />
          <Typography align="center" className={cx.captionFont}>
            1. Open new tabs with your squad
          </Typography>
        </div>
        <div className={cx.explanationCard}>
          <img
            src={squadsStep2}
            height="180px"
            width="250px"
            alt="squad step 1"
          />
          <Typography align="center" className={cx.captionFont}>
            2. Raise enough money to get a shelter cat house trained
          </Typography>
        </div>
        <div className={cx.explanationCard}>
          <img
            src={squadsStep3}
            alt="squad step 1"
            height="180px"
            width="250px"
          />
          <Typography align="center" className={cx.captionFont}>
            3. Trained house cats are much more likely to get adopted
          </Typography>
        </div>
      </div>
      <hr className={cx.hr} />
      {!squadMembers.length && (
        <div className={cx.createSquadContainer}>
          <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Create Your squad now!
          </Typography>
          <TextField
            fullWidth
            value={squadName}
            size="small"
            label="Squad Name"
            helperText="Create a name for your squad!"
            variant="outlined"
            onChange={(event) => setSquadName(event.target.value)}
          />
          <Button
            className={cx.sendButton}
            fullWidth
            variant="contained"
            color="primary"
            onClick={createSquad}
            disabled={!(squadName.length > 3)}
          >
            next
          </Button>
        </div>
      )}
      {(squadMembers.length === 1 || (!squadMembers.length && missionId)) && (
        <div className={cx.createSquadContainer}>
          <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
            Create Your squad now!
          </Typography>
          {renderSocialShare()}
        </div>
      )}
      {squadMembers.length > 1 && (
        <div className={cx.startedContainer}>
          <div className={cx.progressBarContainer}>
            <Typography>
              {`${Math.floor((tabCount / tabGoal) * 100)}%`}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(tabCount / tabGoal) * 100}
              classes={{ root: cx.progressBar }}
            />
          </div>
          <Table className={cx.table}>
            <TableHead>
              <TableRow key="header">
                <TableCell classes={{ head: cx.tableHead }}>
                  Squad Mates
                </TableCell>
                <TableCell classes={{ head: cx.tableHead }} align="left">
                  Tabs today
                </TableCell>
                <TableCell classes={{ head: cx.tableHead }} align="left">
                  Tabs total
                </TableCell>
                <TableCell classes={{ head: cx.tableHead }} align="left">
                  Streak
                </TableCell>
                <TableCell classes={{ head: cx.tableHead }} align="right">
                  Contribution %
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map(
                ({
                  userStatus,
                  user: theUser,
                  tabs,
                  tabsToday,
                  streak,
                  contribution,
                }) => (
                  <TableRow key={theUser}>
                    <TableCell
                      classes={{
                        root: userStatus !== 'accepted' && cx.tableDisabled,
                      }}
                      component="th"
                      scope="row"
                    >
                      {theUser}
                    </TableCell>
                    <TableCell
                      classes={{
                        root: userStatus !== 'accepted' && cx.tableDisabled,
                      }}
                      align="left"
                    >
                      {tabsToday} tabs
                    </TableCell>
                    <TableCell
                      classes={{
                        root: userStatus !== 'accepted' && cx.tableDisabled,
                      }}
                      align="left"
                    >
                      {tabs} tabs
                    </TableCell>
                    <TableCell
                      classes={{
                        root: userStatus !== 'accepted' && cx.tableDisabled,
                      }}
                      align="left"
                    >
                      {streak} days
                    </TableCell>
                    <TableCell
                      classes={{
                        root: userStatus !== 'accepted' && cx.tableDisabled,
                      }}
                      align="right"
                    >
                      {contribution}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
          <div
            className={clsx(
              cx.addSquadMateButton,
              isAddSquadMateOpen && cx.tableDisabled
            )}
            role="button"
            onKeyPress={handleAddSquadMateClick}
            onClick={handleAddSquadMateClick}
            ref={addSquadMatesSection}
            tabIndex={0}
          >
            <AddIcon fontSize="small" />
            <Typography>Add Squad Mates</Typography>
          </div>
          {isAddSquadMateOpen && renderSocialShare()}
        </div>
      )}
    </Paper>
  )
}
CurrentMissionComponent.displayName = 'CurrentMissionComponent'
CurrentMissionComponent.propTypes = {
  /**
    the status of the current mission
  */
}
CurrentMissionComponent.defaultProps = {
  status: '',
}
export default CurrentMissionComponent
