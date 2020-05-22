import React from 'react'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Achievement from 'src/components/Achievement'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
  },
  header: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(4),
  },
  exampleSet: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: theme.spacing(2),
  },
  achievement: {
    margin: theme.spacing(2),
    width: 400,
  },
  achievementBadge: {
    margin: theme.spacing(4),
  },
}))

const DemoAchievementComponent = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h3">Demos of Achievement Types</Typography>
        <Typography variant="body1" gutterBottom>
          Each type in various states: in progress, success (recent), success
          (historical), failure (recent), and failure (historical).
        </Typography>
        <Typography variant="body1" gutterBottom>
          We can choose to show the following buttons: "Invite Friends" and
          "Share"
        </Typography>
      </div>

      <Typography variant="h5">
        Individual achievement (progress bar)
      </Typography>
      <div className={classes.exampleSet}>
        <Achievement
          className={classes.achievement}
          impactText="Plant 1 tree"
          status="inProgress"
          taskText="Open 50 tabs"
          deadlineTime={moment().add(47, 'minutes').toISOString()}
          progress={{
            currentNumber: 11,
            targetNumber: 50,
            visualizationType: 'progressBar',
          }}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 20 trees"
          status="success"
          taskText="Open 50 tabs"
          deadlineTime={moment().subtract(8, 'minutes').toISOString()}
          completionTime={moment().subtract(11, 'minutes').toISOString()}
          progress={{
            currentNumber: 50,
            targetNumber: 50,
            visualizationType: 'progressBar',
          }}
          descriptionTwo="Great job! You planted 20 trees!"
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 20 trees"
          status="failure"
          taskText="Open 50 tabs"
          deadlineTime={moment().subtract(3, 'seconds').toISOString()}
          completionTime={moment().subtract(3, 'seconds').toISOString()}
          progress={{
            currentNumber: 21,
            targetNumber: 50,
            visualizationType: 'progressBar',
          }}
        />
      </div>

      <Typography variant="h5">Individual achievement (checkmarks)</Typography>
      <div className={classes.exampleSet}>
        <Achievement
          className={classes.achievement}
          impactText="Plant 5 trees"
          status="inProgress"
          taskText="Recruit 5 friends"
          deadlineTime={moment().add(92, 'seconds').toISOString()}
          progress={{
            currentNumber: 2,
            targetNumber: 5,
            visualizationType: 'checkmarks',
          }}
          inviteFriendsButton={{ show: true }}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 10 trees"
          status="success"
          taskText="Recruit 10 friends"
          deadlineTime={moment().subtract(2, 'days').toISOString()}
          completionTime={moment().subtract(3, 'days').toISOString()}
          progress={{
            currentNumber: 10,
            targetNumber: 10,
            visualizationType: 'checkmarks',
          }}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 12 trees"
          status="failure"
          taskText="Recruit 12 friends"
          deadlineTime={moment().subtract(7, 'months').toISOString()}
          completionTime={moment().subtract(7, 'months').toISOString()}
          progress={{
            currentNumber: 4,
            targetNumber: 12,
            visualizationType: 'checkmarks',
          }}
          inviteFriendsButton={{ show: true, text: 'Keep Inviting' }}
        />
      </div>

      <Typography variant="h5">Community achievement</Typography>
      <div className={classes.exampleSet}>
        <Achievement
          className={classes.achievement}
          impactText="Plant 10,000 trees"
          status="inProgress"
          taskText="Open 5M tabs"
          deadlineTime={moment().add(40, 'days').toISOString()}
          progress={{
            currentNumber: 2128173,
            targetNumber: 5e6,
            visualizationType: 'progressBar',
          }}
          description="Tiramisu caramels jelly beans ice cream sesame snaps marshmallow
            lollipop pastry danish. Gummi bears oat cake donut cookie chocolate
            jelly jujubes. Muffin marzipan marshmallow danish oat cake. Chupa
            chups candy pastry."
          descriptionTwo="Gummi bears oat cake donut cookie chocolate jelly jujubes."
          isCommunityGoal
          shareButton={{ show: true }}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 10,000 trees"
          status="success"
          taskText="Open 5M tabs"
          deadlineTime={moment().subtract(2, 'years').toISOString()}
          completionTime={moment().subtract(3, 'years').toISOString()}
          progress={{
            currentNumber: 5e6,
            targetNumber: 5e6,
            visualizationType: 'progressBar',
          }}
          isCommunityGoal
          nextGoalButton={{ show: true }}
          shareButton={{ show: true, text: 'Share This' }}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 10,000 trees"
          status="failure"
          taskText="Open 5M tabs"
          deadlineTime={moment().subtract(8, 'years').toISOString()}
          completionTime={moment().subtract(8, 'years').toISOString()}
          progress={{
            currentNumber: 4382111,
            targetNumber: 5e6,
            visualizationType: 'progressBar',
          }}
          isCommunityGoal
        />
      </div>

      <Typography variant="h5">Badges only</Typography>
      <div className={classes.exampleSet}>
        <Achievement
          badgeOnly
          badgeClassName={classes.achievementBadge}
          className={classes.achievement}
          impactText="Plant 1 tree"
          status="inProgress"
          taskText="Open 50 tabs"
          deadlineTime={moment().add(47, 'minutes').toISOString()}
          progress={{
            currentNumber: 11,
            targetNumber: 50,
            visualizationType: 'progressBar',
          }}
        />
        <Achievement
          badgeOnly
          badgeClassName={classes.achievementBadge}
          className={classes.achievement}
          impactText="Plant 20 trees"
          status="success"
          taskText="Open 50 tabs"
          deadlineTime={moment().subtract(8, 'minutes').toISOString()}
          completionTime={moment().subtract(11, 'minutes').toISOString()}
          progress={{
            currentNumber: 50,
            targetNumber: 50,
            visualizationType: 'progressBar',
          }}
          descriptionTwo="Great job! You planted 20 trees!"
        />
        <Achievement
          badgeOnly
          badgeClassName={classes.achievementBadge}
          className={classes.achievement}
          impactText="Plant 20 trees"
          status="failure"
          taskText="Open 50 tabs"
          deadlineTime={moment().subtract(3, 'seconds').toISOString()}
          completionTime={moment().subtract(3, 'seconds').toISOString()}
          progress={{
            currentNumber: 21,
            targetNumber: 50,
            visualizationType: 'progressBar',
          }}
        />
      </div>
    </div>
  )
}

DemoAchievementComponent.displayName = 'DemoAchievementComponent'
DemoAchievementComponent.propTypes = {}
DemoAchievementComponent.defaultProps = {}

export default DemoAchievementComponent
