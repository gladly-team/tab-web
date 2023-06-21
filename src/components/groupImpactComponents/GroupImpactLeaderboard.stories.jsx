import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import GroupImpactLeaderboard from './GroupImpactLeaderboard'

export default {
  title: 'Components/Group Impact/GroupImpactLeaderboard',
  component: GroupImpactLeaderboard,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    background: blue['200'],
    height: 700,
  },
}))

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <GroupImpactLeaderboard {...args} />
    </div>
  )
}

export const standard = Template.bind({})
standard.args = {
  userId: 'cdef',
  leaderboardEntries: [
    {
      position: 1,
      user: {
        id: 'abcd',
        username: 'cat_lover',
      },
      userGroupImpactMetric: {
        dollarContribution: 10000,
        tabDollarContribution: 1000,
        searchDollarContribution: 4000,
        shopDollarContribution: 5000,
      },
    },
    {
      position: 2,
      user: {
        id: 'bcde',
        username: 'tree_lover',
      },
      userGroupImpactMetric: {
        dollarContribution: 9000,
        tabDollarContribution: 1000,
        searchDollarContribution: 4000,
        shopDollarContribution: 4000,
      },
    },
    {
      position: 150,
      user: {
        id: 'cdef',
        username: 'its_me',
      },
      userGroupImpactMetric: {
        dollarContribution: 6120,
        tabDollarContribution: 120,
        searchDollarContribution: 3000,
        shopDollarContribution: 3000,
      },
    },
    {
      position: 151,
      user: {
        id: 'defg',
        username: 'its_not_me',
      },
      userGroupImpactMetric: {
        dollarContribution: 6000,
        tabDollarContribution: 0,
        searchDollarContribution: 3000,
        shopDollarContribution: 3000,
      },
    },
  ],
}
