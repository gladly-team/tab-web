import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import GroupImpactContributionRow from './GroupImpactContributionRow'

export default {
  title: 'Components/Group Impact/GroupImpactContributionRow',
  component: GroupImpactContributionRow,
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
      <GroupImpactContributionRow {...args} />
    </div>
  )
}

export const normal = Template.bind({})
normal.args = {
  userGroupImpactMetricLog: {
    dollarContribution: 13345,
    tabDollarContribution: 11111,
    searchDollarContribution: 1111,
    shopDollarContribution: 123,
    referralDollarContribution: 1000,
    dateStarted: '2020-01-10T10:00:00.000Z',
  },
}

export const selected = Template.bind({})
selected.args = {
  userGroupImpactMetricLog: {
    dollarContribution: 13345,
    tabDollarContribution: 11111,
    searchDollarContribution: 1111,
    shopDollarContribution: 123,
    referralDollarContribution: 1000,
    dateStarted: '2020-01-10T10:00:00.000Z',
  },
}
