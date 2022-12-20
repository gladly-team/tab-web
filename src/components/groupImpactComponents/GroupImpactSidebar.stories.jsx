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
  groupImpactMetric: {
    dollarProgress: 28e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 1 home visit from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
  badgeText: 'New',
}

export const closed = Template.bind({})
closed.args = {
  open: false,
  groupImpactMetric: {
    dollarProgress: 28e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 1 home visit from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
  badgeText: 'New',
}

export const withButton = Template.bind({})
withButton.args = {
  open: true,
  groupImpactMetric: {
    dollarProgress: 28e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 1 home visit from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
  badgeText: 'New',
  nextGoalButtonClickHandler: () => {},
}

export const withOldGoal = Template.bind({})
withOldGoal.args = {
  open: true,
  lastGroupImpactMetric: {
    dollarProgress: 5e6,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 1 home visit from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
  groupImpactMetric: {
    dollarProgress: 10e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 2 home visits from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
  badgeText: 'New',
}
