import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import GroupImpactSidebar from './GroupImpactSidebar'

export default {
  title: 'Components/Group Impact/GroupImpactSidebar',
  component: GroupImpactSidebar,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    background: blue['200'],
    height: 1000,
  },
}))

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <GroupImpactSidebar {...args} />
    </div>
  )
}

export const standard = Template.bind({})
standard.args = {
  impactMetric: {
    impactTitle: "Provide 1 home visit from a community health worker",
    whyValuableDescription: "Community health workers provide quality health care to those who might not otherwise have access."
  },
  groupImpactMetric: {
    dollarProgress: 28e5,
    dollarGoal: 5e6
  },
  participants: 109382,
  badgeText: "New"
}