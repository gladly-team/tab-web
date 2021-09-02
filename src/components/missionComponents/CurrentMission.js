import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import AddIcon from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import Table from '@material-ui/core/Table'
import Button from '@material-ui/core/Button'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import squadsStep1 from 'src/assets/images/squadsStep1.png'
import squadsStep2 from 'src/assets/images/squadsStep2.png'
import squadsStep3 from 'src/assets/images/squadsStep3.png'
import TextField from '@material-ui/core/TextField'
import CreateNewMissionMutation from 'src/utils/mutations/CreateNewMissionMutation'
import CustomAlert from 'src/components/CustomAlert'
import MissionSocialShare from 'src/components/missionComponents/MissionSocialShare'
import MissionComplete from 'src/components/missionComponents/MissionComplete'

const Accordion = withStyles({
  root: {
    width: '100%',
    borderBottom: 'none',
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
  root: {
    padding: '0px',
    borderBottom: 'none',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
}))(MuiAccordionDetails)
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
  sendButton: {
    marginTop: theme.spacing(2),
    height: theme.spacing(3),
    backgroundColor: theme.palette.colors.purple1,
  },
  createSquadContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '468px',
    alignSelf: 'center',
  },
}))

const CurrentMissionComponent = ({ user }) => {
  const cx = useStyles()
  const [expanded, setExpanded] = useState(false)
  const [isAddSquadMateOpen, setIsAddSquadMateOpen] = useState(false)
  const [squadName, setSquadName] = useState('')
  const [currentMission, setCurrentMission] = useState(
    (user || {}).currentMission || {}
  )
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
    if (isAddSquadMateOpen === false) {
      // eslint-disable-next-line no-undef
      window.scrollTo({
        left: 0,
        top: addSquadMatesSection.current.offsetTop - 216,
        behavior: 'smooth',
      })
    }
  }
  const createSquad = async () => {
    const {
      createNewMission: { currentMission: newCurrentMission },
    } = await CreateNewMissionMutation(id, squadName)
    setCurrentMission(newCurrentMission)
  }
  const { tabCount = 0, tabGoal = 1000, missionId, squadMembers = [], status } =
    currentMission || {}
  const onEmailsSent = (newMissionData) => {
    setCurrentMission(newMissionData)
    setIsAddSquadMateOpen(false)
  }
  const createTableData = () =>
    squadMembers.reduce((tableData, member) => {
      const {
        status: userStatus,
        invitedEmail,
        username: squadUserName,
        tabs = 0,
        currentTabStreak = 0,
        missionCurrentTabsDay = 0,
      } = member
      const pivotedMemberData = {
        userStatus,
        user:
          userStatus === 'accepted'
            ? squadUserName
            : `${invitedEmail || squadUserName} (awaiting response)`,
        tabsToday: missionCurrentTabsDay || 0,
        tabs,
        streak: currentTabStreak || 0,
        contribution: `${Math.round((tabs / tabCount) * 100) || 0}%`,
      }
      tableData.push(pivotedMemberData)
      return tableData
    }, [])
  const tableData = createTableData()
  return (
    <Paper elevation={1} className={cx.topContainer}>
      {status === 'completed' ? (
        <MissionComplete mission={currentMission} user={user} />
      ) : (
        <>
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
                  shelter cat adopted! When you work together with your squad
                  you can make a larger impact, sooner.
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography className={cx.subtitleFont}>
                  Every tab you open supports cats in need. Squads enables you
                  to team up with friends and earn more treats together. Cats
                  can get adopted up to 3x faster with Squads! You can create
                  your first squad today, just start with a couple invites
                  below!
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
              <Typography
                style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
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
          {(squadMembers.length === 1 ||
            (!squadMembers.length && missionId)) && (
            <div className={cx.createSquadContainer}>
              <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
                Create Your squad now!
              </Typography>
              <MissionSocialShare
                user={{ username, id }}
                emailSentCallback={onEmailsSent}
                missionId={currentMission.missionId}
              />
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
                data-test-id="addSquadMateButton"
              >
                <AddIcon fontSize="small" />
                <Typography>Add Squad Mates</Typography>
              </div>
              {isAddSquadMateOpen && (
                <MissionSocialShare
                  user={{ username, id }}
                  emailSentCallback={onEmailsSent}
                  missionId={currentMission.missionId}
                />
              )}
            </div>
          )}{' '}
        </>
      )}
    </Paper>
  )
}
CurrentMissionComponent.displayName = 'CurrentMissionComponent'
CurrentMissionComponent.propTypes = {
  /**
    the status of the current mission
  */
  user: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    currentMission: PropTypes.any,
  }),
}
CurrentMissionComponent.defaultProps = {
  user: {},
}
export default CurrentMissionComponent
