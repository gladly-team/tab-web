import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import GroupImpact from './GroupImpact'

export default {
  title: 'Components/Group Impact/GroupImpact',
  component: GroupImpact,
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
      <GroupImpact {...args} />
    </div>
  )
}

export const open = Template.bind({})
open.args = {
  groupImpactMetric: {
    dollarProgress: 28e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 1 home visit from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
}
