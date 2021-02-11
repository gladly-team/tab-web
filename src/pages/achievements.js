import React from 'react'
import dayjs from 'dayjs'
import { flowRight } from 'lodash/util'
import { makeStyles } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'
import Typography from '@material-ui/core/Typography'
import SettingsPage from 'src/components/SettingsPage'
import return404If from 'src/utils/pageWrappers/return404If'
import { showMockAchievements } from 'src/utils/featureFlags'
import Achievement from 'src/components/Achievement'
import logUncaughtErrors from 'src/utils/pageWrappers/logUncaughtErrors'

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContainer: {
    position: 'relative',
    width: '100%',
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineBar: {
    position: 'absolute',
    zIndex: 10,
    height: 'calc(100% - 100px)',
    top: 40,
    width: 24,
    background: grey['300'],
  },
  timelineEnd: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    background: grey['300'],
    zIndex: 20,
    marginTop: 40,
  },
  timelineEndTextContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
  },
  timelineEndText: {
    lineHeight: '1.4em',
  },
  achievement: {
    width: '100%',
    maxWidth: 500,
    minWidth: 275,
    margin: theme.spacing(2),
    position: 'relative',
    zIndex: 100,
  },
}))

const Achievements = () => {
  const classes = useStyles()
  return (
    <SettingsPage>
      <div className={classes.contentContainer}>
        <div className={classes.timelineContainer}>
          <div className={classes.timelineBar} />
          <Achievement
            className={classes.achievement}
            impactText="Plant 1 tree"
            status="inProgress"
            taskText="Open tabs 5 days in a row"
            deadlineTime={dayjs().add(3, 'days').toISOString()}
            progress={{
              currentNumber: 2,
              targetNumber: 5,
              visualizationType: 'checkmarks',
            }}
          />
          <Achievement
            className={classes.achievement}
            impactText="Build a library in Cambodia"
            status="inProgress"
            taskText="Recruit 1,000 new people"
            deadlineTime={dayjs().add(40, 'days').toISOString()}
            progress={{
              currentNumber: 772,
              targetNumber: 1000,
              visualizationType: 'progressBar',
            }}
            description="Tiramisu caramels jelly beans ice cream sesame snaps marshmallow lollipop pastry danish. Gummi bears oat cake donut cookie chocolate jelly jujubes. Muffin marzipan marshmallow danish oat cake. Chupa chups candy pastry."
            descriptionTwo="Gummi bears oat cake donut cookie chocolate jelly jujubes."
            isCommunityGoal
            inviteFriendsButton={{ show: true }}
          />
          <Achievement
            className={classes.achievement}
            impactText="Plant 2 trees"
            status="failure"
            taskText="Recruit 2 friends"
            deadlineTime={dayjs().subtract(3, 'days').toISOString()}
            completionTime={dayjs().subtract(3, 'days').toISOString()}
            // progress={{
            //   currentNumber: 1,
            //   targetNumber: 2,
            //   visualizationType: 'checkmarks',
            // }}
          />
          <Achievement
            className={classes.achievement}
            impactText="Fund 100 beehives in Nicaragua"
            status="success"
            taskText="Open tabs"
            completionTime={dayjs().subtract(16, 'days').toISOString()}
            // progress={{
            //   currentNumber: 772,
            //   targetNumber: 1000,
            //   visualizationType: 'progressBar',
            // }}
            description="Tiramisu caramels jelly beans ice cream sesame snaps marshmallow lollipop pastry danish. Gummi bears oat cake donut cookie chocolate jelly jujubes. Muffin marzipan marshmallow danish oat cake. Chupa chups candy pastry."
            descriptionTwo="Gummi bears oat cake donut cookie chocolate jelly jujubes."
            isCommunityGoal
            shareButton={{ show: true }}
          />
          <Achievement
            className={classes.achievement}
            impactText="Plant 1 tree"
            status="success"
            taskText="Open 100 tabs"
            completionTime={dayjs().subtract(21, 'days').toISOString()}
            // progress={{
            //   currentNumber: 100,
            //   targetNumber: 100,
            //   visualizationType: 'progressBar',
            // }}
            shareButton={{ show: true }}
          />
          <Achievement
            className={classes.achievement}
            impactText="Gave 25,000 meals to kids"
            status="success"
            taskText="Open tabs"
            completionTime={dayjs().subtract(6, 'weeks').toISOString()}
            description="Nearly 22 million low-income kids in the United States rely on the free and reduced-price meals they receive at school. With schools closed in districts nationwide, children may be left without that critical lifeline to healthy meals."
            descriptionTwo="To help combat this, we supported No Kid Hungry in their efforts to make sure all children have access to nutritious meals throughout the crisis."
            isCommunityGoal
            shareButton={{ show: true }}
          />
          <div className={classes.timelineEnd} />
        </div>
        <div className={classes.timelineEndTextContainer}>
          <Typography
            variant="overline"
            align="center"
            className={classes.timelineEndText}
          >
            Joined Tab for a Cause
          </Typography>
          <Typography
            variant="overline"
            align="center"
            className={classes.timelineEndText}
          >
            January 1, 2020
          </Typography>
        </div>
      </div>
    </SettingsPage>
  )
}

Achievements.displayName = 'Achievements'
Achievements.propTypes = {}
Achievements.defaultProps = {}

export const getServerSideProps = flowRight([
  logUncaughtErrors,
  return404If(!showMockAchievements()),
])()

export default Achievements
