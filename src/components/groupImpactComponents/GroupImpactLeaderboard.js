import Link from 'src/components/Link'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import ArrowBackIos from '@material-ui/icons/ArrowBackIos'
import clsx from 'clsx'
import { groupImpactLeaderboardFAQ } from 'src/utils/urls'
import GroupImpactLeaderboardRow from './GroupImpactLeaderboardRow'

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
  },
  leaderboard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    width: '500px',
  },
  ellipses: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingTop: theme.spacing(0),
  },
  robotoBold: {
    fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 900,
  },
  closeButton: {
    borderRadius: '8px',
    marginLeft: 'auto',
  },
  closeButtonIcon: {
    width: 30,
    height: 30,
    marginRight: '-16px',
  },
  positionRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    alignItems: 'center',
  },
  impactPoints: {
    marginLeft: 'auto',
  },
  position: {
    marginRight: theme.spacing(2),
    width: '90px',
  },
  subtitle: {
    marginBottom: theme.spacing(2),
  },
  link: {
    color: theme.palette.primary.main,
  },
}))

const Leaderboard = ({ leaderboardEntries, userId, onClose }) => {
  const classes = useStyles()
  const displayLeaderboardEntries = []
  let maxDollarContributionSeen = 0
  for (let i = leaderboardEntries.length - 1; i >= 0; i -= 1) {
    const entry = leaderboardEntries[i]
    let userGroupImpactMetric = null
    if (
      entry.userGroupImpactMetric.dollarContribution < maxDollarContributionSeen
    ) {
      userGroupImpactMetric = {
        ...entry.userGroupImpactMetric,
        dollarContribution: maxDollarContributionSeen,
      }
    } else {
      userGroupImpactMetric = entry.userGroupImpactMetric
      maxDollarContributionSeen = entry.userGroupImpactMetric.dollarContribution
    }
    displayLeaderboardEntries.unshift(
      <div key={`${entry.user.username}_${entry.position}`}>
        <GroupImpactLeaderboardRow
          selected={userId === entry.user.id}
          position={entry.position}
          username={entry.user.username}
          userGroupImpactMetric={userGroupImpactMetric}
        />
        <Divider />
      </div>
    )
  }

  const entriesWithEllipses = []
  for (let i = 0; i < displayLeaderboardEntries.length; i += 1) {
    entriesWithEllipses.push(displayLeaderboardEntries[i])

    if (i < displayLeaderboardEntries.length - 1) {
      const currentPosition = leaderboardEntries[i].position
      const nextPosition = leaderboardEntries[i + 1].position
      if (nextPosition - currentPosition > 1) {
        entriesWithEllipses.push(
          <div
            key={`${nextPosition}_${currentPosition}`}
            className={classes.ellipses}
          >
            <Typography variant="h3">...</Typography>
          </div>
        )
      }
    }
  }

  return (
    <div className={classes.leaderboard}>
      <div className={classes.title}>
        <div>
          <Typography variant="h5" className={classes.robotoBold}>
            WEEKLY LEADERBOARD
          </Typography>
          <Typography variant="body2" className={classes.subtitle}>
            Impact points earned for this group goal by opening tabs, searching,
            and/or shopping.{' '}
            <Link
              to={groupImpactLeaderboardFAQ}
              target="_blank"
              stopPropagation
            >
              <span className={classes.link}>Learn More</span>
            </Link>
          </Typography>
        </div>

        {onClose && (
          <Button onClick={onClose} className={classes.closeButton}>
            <ArrowBackIos className={classes.closeButtonIcon} />
          </Button>
        )}
      </div>
      <div className={classes.positionRow}>
        <Typography className={classes.position} variant="h6">
          Position
        </Typography>
        <div className={classes.column}>
          <Typography className={classes.bold} variant="h6">
            Username
          </Typography>
        </div>
        <Typography
          className={clsx(classes.bold, classes.impactPoints)}
          variant="h6"
        >
          Impact Points
        </Typography>
      </div>
      <Divider />
      {entriesWithEllipses}
    </div>
  )
}

Leaderboard.propTypes = {
  userId: PropTypes.string.isRequired,
  leaderboardEntries: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.number.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string,
        username: PropTypes.string,
      }).isRequired,
      userGroupImpactMetric: PropTypes.shape({
        dollarContribution: PropTypes.number.isRequired,
        tabDollarContribution: PropTypes.number,
        searchDollarContribution: PropTypes.number,
        shopDollarContribution: PropTypes.number,
        referralDollarContribution: PropTypes.number,
      }).isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func,
}

Leaderboard.defaultProps = {
  onClose: null,
}

export default Leaderboard
