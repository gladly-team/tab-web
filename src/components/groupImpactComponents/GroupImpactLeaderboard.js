import { Typography } from '@material-ui/core'
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import GroupImpactLeaderboardRow from './GroupImpactLeaderboardRow'

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(2),
  },
  leaderboard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  ellipses: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(0),
  },
}))

const Leaderboard = ({ leaderboardEntries, userId }) => {
  const classes = useStyles()
  const displayLeaderboardEntries = leaderboardEntries.map((entry) => (
    <div key={`${entry.user.username}_${entry.position}`}>
      <GroupImpactLeaderboardRow
        selected={userId === entry.user.id}
        position={entry.position}
        username={entry.user.username}
        userGroupImpactMetric={entry.userGroupImpactMetric}
      />
      <Divider />
    </div>
  ))

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
            <Typography variant="h2">...</Typography>
          </div>
        )
      }
    }
  }

  return (
    <div className={classes.leaderboard}>
      <div className={classes.title}>
        <Typography variant="h3">Leaderboard</Typography>
      </div>
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
      }).isRequired,
    })
  ).isRequired,
}

export default Leaderboard
