import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import GroupImpactLeaderboardRow from './GroupImpactLeaderboardRow'

export default {
  title: 'Components/Group Impact/GroupImpactLeaderboardRow',
  component: GroupImpactLeaderboardRow,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    background: blue['200'],
    width: 500,
  },
}))

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <GroupImpactLeaderboardRow {...args} />
    </div>
  )
}

export const normal = Template.bind({})
normal.args = {
  position: 13567,
  username: 'cat_lover',
  userGroupImpactMetric: {
    dollarContribution: 12345,
    tabDollarContribution: 11111,
    searchDollarContribution: 1111,
    shopDollarContribution: 123,
  },
}
