import React from 'react'
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Achievement from 'src/components/Achievement'
import return404If from 'src/utils/pageWrappers/return404If'
import { showDevelopmentOnlyDemoPages } from 'src/utils/featureFlags'

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
    marginBottom: theme.spacing(4),
  },
  achievement: {
    margin: theme.spacing(2),
    width: 400,
  },
  achievementBadge: {
    margin: theme.spacing(4),
  },
}))

const AchievementComponentDemoPage = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h3" gutterBottom>
          Demos of Achievement Types
        </Typography>
        <Typography variant="body1" gutterBottom>
          Here are achievements in various states: in progress, success
          (recent), failure (recent), success (historical), and failure
          (historical).
        </Typography>
        <Typography variant="body1">We can optionally show:</Typography>
        <ul>
          <li>
            <Typography variant="body1">
              a visualization of progress (progress bar or checkmarks)
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              text above and/or below the progress visualization
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              buttons for "Invite Friends", "Share", and "Next Goal", with
              customizable text
            </Typography>
          </li>
        </ul>
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
          impactText="Plant 1 tree"
          status="success"
          taskText="Open 50 tabs"
          deadlineTime={moment().subtract(8, 'minutes').toISOString()}
          completionTime={moment().subtract(11, 'minutes').toISOString()}
          progress={{
            currentNumber: 50,
            targetNumber: 50,
            visualizationType: 'progressBar',
          }}
          descriptionTwo="Great job! You planted a tree! This text is customizable or can be hidden."
          nextGoalButton={{ show: true }}
          shareButton={{ show: true }}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 1 tree"
          status="failure"
          taskText="Open 50 tabs"
          deadlineTime={moment().subtract(3, 'seconds').toISOString()}
          completionTime={moment().subtract(3, 'seconds').toISOString()}
          progress={{
            currentNumber: 21,
            targetNumber: 50,
            visualizationType: 'progressBar',
          }}
          descriptionTwo="Unfortunately, you didn't meet this goal, but your tabs are still doing good. Keep it up!"
          nextGoalButton={{ show: true }}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 1 tree"
          status="success"
          taskText="Open 50 tabs"
          deadlineTime={moment().subtract(5, 'weeks').toISOString()}
          completionTime={moment().subtract(5, 'weeks').toISOString()}
          shareButton={{ show: true }}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 1 tree"
          status="failure"
          taskText="Open 50 tabs"
          deadlineTime={moment().subtract(5, 'weeks').toISOString()}
          completionTime={moment().subtract(5, 'weeks').toISOString()}
          nextGoalButton={{ show: false }}
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
          nextGoalButton={{ show: true }}
          shareButton={{ show: true }}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 12 trees"
          status="failure"
          taskText="Recruit 12 friends"
          deadlineTime={moment().subtract(9, 'minutes').toISOString()}
          completionTime={moment().subtract(9, 'minutes').toISOString()}
          progress={{
            currentNumber: 4,
            targetNumber: 12,
            visualizationType: 'checkmarks',
          }}
          nextGoalButton={{ show: true }}
          inviteFriendsButton={{ show: true, text: 'Keep Inviting' }}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 10 trees"
          status="success"
          taskText="Recruit 10 friends"
          deadlineTime={moment().subtract(2, 'months').toISOString()}
          completionTime={moment().subtract(3, 'months').toISOString()}
          shareButton={{ show: true }}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 12 trees"
          status="failure"
          taskText="Recruit 12 friends"
          deadlineTime={moment().subtract(7, 'months').toISOString()}
          completionTime={moment().subtract(7, 'months').toISOString()}
        />
      </div>

      <Typography variant="h5">Achievement with no deadline</Typography>
      <div className={classes.exampleSet}>
        <Achievement
          className={classes.achievement}
          impactText="Reach 1,000 trees Planted"
          status="inProgress"
          taskText="Open 132 tabs"
          progress={{
            currentNumber: 18,
            targetNumber: 132,
            visualizationType: 'progressBar',
          }}
          description="Wow, you've nearly planted 1,000 trees by opening tabs!"
        />
        <Achievement
          className={classes.achievement}
          impactText="Reach 1,000 trees Planted"
          status="success"
          taskText="Open 132 tabs"
          completionTime={moment().subtract(11, 'minutes').toISOString()}
          descriptionTwo="Great work: you've planted 1,000 trees by opening tabs! Share this milestone:"
          shareButton={{ show: true }}
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
          description="We could make long descriptions here collapsed by default on the new tab page (expand to read details). Tiramisu caramels jelly beans ice cream sesame snaps marshmallow
            lollipop pastry danish. Gummi bears oat cake donut cookie chocolate
            jelly jujubes. Muffin marzipan marshmallow danish oat cake. Chupa
            chups candy pastry."
          descriptionTwo="Gummi bears oat cake donut cookie chocolate jelly jujubes."
          isCommunityGoal
          inviteFriendsButton={{ show: true, text: 'Tell Friends to Join' }}
        />
        <Achievement
          className={classes.achievement}
          impactText="Plant 10,000 trees"
          status="success"
          taskText="Open 5M tabs"
          deadlineTime={moment().subtract(2, 'years').toISOString()}
          completionTime={moment().subtract(3, 'years').toISOString()}
          description="Congrats! When we succeed, we can choose to hide the progress bar and just show text."
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
          descriptionTwo="We didn't quite hit this goal, but we were still able to plant 8,432 trees. Great job!"
          isCommunityGoal
          nextGoalButton={{ show: true }}
          shareButton={{ show: true }}
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

AchievementComponentDemoPage.displayName = 'AchievementComponentDemoPage'
AchievementComponentDemoPage.propTypes = {}
AchievementComponentDemoPage.defaultProps = {}

export default return404If(!showDevelopmentOnlyDemoPages())(
  AchievementComponentDemoPage
)
