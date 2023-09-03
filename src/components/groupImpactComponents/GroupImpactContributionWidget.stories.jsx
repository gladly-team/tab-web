import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import GroupImpactContributionWidget from './GroupImpactContributionWidget'

export default {
  title: 'Components/Group Impact/GroupImpactContributionWidget',
  component: GroupImpactContributionWidget,
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
      <GroupImpactContributionWidget {...args} />
    </div>
  )
}

export const standard = Template.bind({})
standard.args = {
  groupImpactHistory: [
    {
      dollarContribution: 18700,
      tabDollarContribution: 1000,
      searchDollarContribution: 4000,
      shopDollarContribution: 5000,
      referralDollarContribution: 8700,
      dateStarted: '2017-07-17T20:45:53Z',
    },
  ],
}
