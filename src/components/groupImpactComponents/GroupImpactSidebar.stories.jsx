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
    height: 700,
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

export const open = Template.bind({})
open.args = {
  open: true,
  impactMetric: {
    impactTitle: 'Provide 1 home visit from a community health worker',
    whyValuableDescription:
      'Community health workers provide quality health care to those who might not otherwise have access.',
  },
  groupImpactMetric: {
    dollarProgress: 28e5,
    dollarGoal: 5e6,
  },
  badgeText: 'New',
}

export const closed = Template.bind({})
closed.args = {
  open: false,
  impactMetric: {
    impactTitle: 'Provide 1 home visit from a community health worker',
    whyValuableDescription:
      'Community health workers provide quality health care to those who might not otherwise have access.',
  },
  groupImpactMetric: {
    dollarProgress: 28e5,
    dollarGoal: 5e6,
  },
  badgeText: 'New',
}
