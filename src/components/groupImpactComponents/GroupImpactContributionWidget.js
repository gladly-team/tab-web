import Link from 'src/components/Link'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import clsx from 'clsx'
import { groupImpactLeaderboardFAQ } from 'src/utils/urls'
import GroupImpactContributionRow from './GroupImpactContributionRow'

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
    borderLeft: '1px solid grey',
  },
  robotoBold: {
    fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 900,
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
    width: '100px',
  },
  subtitle: {
    marginBottom: theme.spacing(2),
  },
  link: {
    color: theme.palette.primary.main,
  },
}))

const GroupImpactContributionWidget = ({ groupImpactHistory }) => {
  const classes = useStyles()
  return (
    <div className={classes.leaderboard}>
      <div className={classes.title}>
        <div>
          <Typography variant="h5" className={classes.robotoBold}>
            PAST IMPACT
          </Typography>
          <Typography variant="body2" className={classes.subtitle}>
            Impact points earned for past group goals by opening tabs,
            searching, and/or shopping.{' '}
            <Link
              to={groupImpactLeaderboardFAQ}
              target="_blank"
              stopPropagation
            >
              <span className={classes.link}>Learn More</span>
            </Link>
          </Typography>
        </div>
      </div>
      <div className={classes.positionRow}>
        <Typography className={classes.position} variant="h6">
          Week Of
        </Typography>
        <div className={classes.column}>
          <Typography className={classes.bold} variant="h6">
            How You Contributed
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
      {groupImpactHistory.map((impactLog) => (
        <GroupImpactContributionRow
          key={impactLog.dateStarted}
          userGroupImpactMetricLog={impactLog}
        />
      ))}
    </div>
  )
}

GroupImpactContributionWidget.propTypes = {
  groupImpactHistory: PropTypes.arrayOf(
    PropTypes.shape({
      dollarContribution: PropTypes.number.isRequired,
      tabDollarContribution: PropTypes.number,
      searchDollarContribution: PropTypes.number,
      shopDollarContribution: PropTypes.number,
      referralDollarContribution: PropTypes.number,
    }).isRequired
  ).isRequired,
}

export default GroupImpactContributionWidget
