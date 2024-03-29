import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CustomAlert from 'src/components/missionComponents/MissionAlert'
import Button from '@material-ui/core/Button'
import trophyCat from 'src/assets/images/trophycat.svg'
import LinearProgress from '@material-ui/core/LinearProgress'
import PersonalAcheivementCard from 'src/components/PersonalAcheivementCard'
import AcheivementBadge from 'src/components/AcheivementBadge'
import moment from 'moment'
import clsx from 'clsx'

const AVERAGE_USER_TABS_DAY = 12
const useStyles = makeStyles((theme) => ({
  topContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  verticalSpacing: {
    marginTop: theme.spacing(2),
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
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
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
  progressBar: {
    width: `calc(100% - ${theme.spacing(6)}px)`,
  },
  progressBarContainer: {
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    width: '100%',
    marginTop: theme.spacing(2),
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
  titleLeft: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    justifyContent: 'space-between',
  },
  restartContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
  },
}))
const MissionComplete = ({
  mission,
  user: { username, pendingMissionInvites = [], id },
  showRestart,
  restartMission,
  className,
}) => {
  const {
    tabCount,
    tabGoal,
    squadMembers,
    started,
    completed,
    endOfMissionAwards,
  } = mission || {}
  const cx = useStyles()
  const daysToComplete = moment
    .duration(moment(completed).diff(started))
    .asDays()
  const teamTabsPerDay = tabGoal / daysToComplete
  const teamRateOverTypicalUser =
    Math.round((teamTabsPerDay / AVERAGE_USER_TABS_DAY) * 10) / 10
  const userStats = squadMembers.filter((item) => item.username === username)[0]
  return (
    <div className={clsx(cx.topContainer, className)}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div className={cx.titleLeft}>
          <Typography variant="h5">Mission Complete</Typography>
          <div className={cx.verticalSpacing}>
            <CustomAlert
              icon="done"
              text="Team up with your friends and help give a shelter cat a new home and family!"
            />
          </div>
          <Typography className={cx.verticalSpacing}>
            With the help of{' '}
            <span style={{ fontWeight: 'bold' }}>
              {squadMembers.length} other{squadMembers.length === 1 ? '' : 's'}
            </span>
            , you helped house train a cat faster than you could have alone!
            That means more space at the shelter for other homeless kittens,
            even sooner.
          </Typography>
          <Typography className={cx.verticalSpacing}>
            The staff - and the cats - at The Jackson Galaxy Project thank you!
          </Typography>
        </div>
        <div
          style={{
            width: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src={trophyCat} alt="trophy cat" />
        </div>
      </div>
      <div className={cx.progressBarContainer}>
        <Typography>{`${Math.floor((tabCount / tabGoal) * 100)}%`}</Typography>
        <LinearProgress
          variant="determinate"
          value={(tabCount / tabGoal) * 100}
          classes={{ root: cx.progressBar }}
        />
      </div>
      <hr className={cx.hr} />
      <div>
        <Typography variant="h6">What you accomplished:</Typography>
        <Typography>Look at the impact you made in your squad</Typography>
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            cursor: 'pointer',
          }}
        >
          <PersonalAcheivementCard
            title={`${squadMembers.length} Squad Mates`}
            text="You completed your mission"
          />
          <PersonalAcheivementCard
            title={`${teamRateOverTypicalUser}x faster`}
            text={`Your team hit the tab goal ${teamRateOverTypicalUser}x faster than a typical user`}
          />
          <PersonalAcheivementCard
            title={`${userStats.longestTabStreak} days`}
            text={`You had a streak of ${userStats.longestTabStreak} days of tabbing!`}
          />
          <PersonalAcheivementCard
            title={`${userStats.tabs} tabs`}
            text="How many tabs you opened throughout the mission"
          />
          <PersonalAcheivementCard
            title={`${userStats.missionMaxTabsDay} tabs`}
            text="The most tabs you opened in a single day"
          />
        </div>
      </div>
      <hr className={cx.hr} />
      <div>
        <Typography variant="h6">Team Awards:</Typography>
        <Typography>Check out the top performers in your squad!</Typography>
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            justifyContent: 'center',
          }}
        >
          {endOfMissionAwards.map(({ user: userAgain, unit, awardType }) => (
            <AcheivementBadge
              awardType={awardType}
              user={userAgain}
              stat={unit}
              key={awardType}
            />
          ))}
        </div>
      </div>
      <hr className={cx.hr} />
      <div className={cx.restartContainer}>
        {showRestart && pendingMissionInvites.length === 0 && (
          <Button onClick={restartMission} variant="contained" color="primary">
            RESTART MISSION
          </Button>
        )}
        {showRestart && pendingMissionInvites.length > 0 && (
          <CustomAlert
            text={`your friend ${pendingMissionInvites[0].invitingUser.name} invited you to join their squad!`}
            missionId={pendingMissionInvites[0].missionId}
            id={id}
            icon="message"
          />
        )}
      </div>
    </div>
  )
}
MissionComplete.displayName = 'MissionComplete'

MissionComplete.propTypes = {
  /**
    the username and user id nested in a user object
  */
  user: PropTypes.shape({
    username: PropTypes.string,
    id: PropTypes.string,
    pendingMissionInvites: PropTypes.arrayOf(
      PropTypes.shape({
        missionId: PropTypes.string,
        invitingUser: PropTypes.shape({ name: PropTypes.string }),
      })
    ),
  }).isRequired,

  /**
    the mission to show
  */
  mission: PropTypes.shape({
    squadName: PropTypes.string,
    started: PropTypes.string,
    completed: PropTypes.string,
    missionId: PropTypes.string,
    status: PropTypes.string,
    tabGoal: PropTypes.number,
    tabCount: PropTypes.number,
    squadMembers: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string,
        invitedEmail: PropTypes.string,
        status: PropTypes.string,
        tabs: PropTypes.number,
      })
    ),
    endOfMissionAwards: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.string,
        awardType: PropTypes.string,
        unit: PropTypes.number,
      })
    ),
  }).isRequired,

  /**
    function that restarts the completed missions
   */
  restartMission: PropTypes.func,

  /**
    whether to give the user the option to restart or rejoin missions
  */
  showRestart: PropTypes.bool,

  /**
    top container class name override
  */
  className: PropTypes.string,
}
MissionComplete.defaultProps = {
  showRestart: false,
  restartMission: null,
  className: '',
}
export default MissionComplete
