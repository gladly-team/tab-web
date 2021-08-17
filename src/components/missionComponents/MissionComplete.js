import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Typography from '@material-ui/core/Typography'
import CustomAlert from 'src/components/CustomAlert'
import trophyCat from 'src/assets/images/trophycat.svg'
import LinearProgress from '@material-ui/core/LinearProgress'
import PersonalAcheivementCard from 'src/components/PersonalAcheivementCard'
import AcheivementBadge from 'src/components/AcheivementBadge'
import moment from 'moment'
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
    marginBottom: theme.spacing(4),
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
}))
const MissionComplete = ({ mission, user }) => {
  const {
    tabCount = 0,
    tabGoal = 1000,
    squadMembers = [],
    started,
    completed,
    endOfMissionAwards = [],
  } = mission || {}
  const cx = useStyles()
  const daysToComplete = moment
    .duration(moment(completed).diff(started))
    .asDays()
  const teamTabsPerDay = tabGoal / daysToComplete
  const teamRateOverTypicalUser =
    Math.round((teamTabsPerDay / AVERAGE_USER_TABS_DAY) * 10) / 10
  const userStats = squadMembers.filter(
    (item) => item.username === user.username
  )[0]

  console.log(endOfMissionAwards, 'mission complete')
  return (
    <div className={cx.topContainer}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div className={cx.titleLeft}>
          <Typography style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Mission Complete
          </Typography>
          <div className={cx.verticalSpacing}>
            <CustomAlert
              done
              text="Team up with your friends and help give a shelter cat a new home and family!"
            />
          </div>
          <Typography className={cx.verticalSpacing}>
            With the help of{' '}
            <span style={{ fontWeight: 'bold' }}>
              {squadMembers.length} others
            </span>
            , you got a cat a training session faster than the average
            individual tabber! That means more space at the shelter for other
            homeless kittens, even sooner!
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
        <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
          What you accomplished:
        </Typography>
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
            text={`Your team helped get a cat adopted ${teamRateOverTypicalUser} faster than a typical user`}
          />
          <PersonalAcheivementCard
            title={`${squadMembers.length} Squad Mates`}
            text="You completed your mission"
          />
          <PersonalAcheivementCard
            title={`${squadMembers.length} Squad Mates`}
            text="You completed your mission"
          />
          <PersonalAcheivementCard
            title={`${squadMembers.length} Squad Mates`}
            text="You completed your mission"
          />
          <PersonalAcheivementCard
            title={`${squadMembers.length} Squad Mates`}
            text="You completed your mission"
          />
          <PersonalAcheivementCard
            title={`${squadMembers.length} Squad Mates`}
            text="You completed your mission"
          />
          <PersonalAcheivementCard
            title={`${squadMembers.length} Squad Mates`}
            text="You completed your mission"
          />
        </div>
      </div>
      <hr
        className={cx.hr}
        style={{ marginTop: '16px', marginBottom: '16px' }}
      />
      <div>
        <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
          Team Awards:
        </Typography>
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
            />
          ))}
        </div>
      </div>
      <hr className={cx.hr} />
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
  }).isRequired,

  /**
    the mission id to put in the referral link and email
  */
  mission: PropTypes.shape({
    status: PropTypes.string,
  }),

  /**
    callback to be invoked when CreateSquadInvitesMutation returns
  */
  emailSentCallback: PropTypes.func,
}
MissionComplete.defaultProps = {
  missionId: '',
  emailSentCallback: () => {},
}

export default MissionComplete
