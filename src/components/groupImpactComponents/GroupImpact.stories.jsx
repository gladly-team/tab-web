import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import localstorageGroupImpactManager from 'src/utils/localstorageGroupImpactManager'
import localstorageManager from 'src/utils/localstorage-mgr'
import { COMPLETED_GROUP_IMPACT_VIEWS } from 'src/utils/constants'
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
    id: 'abcd',
    dollarProgress: 28e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 1 home visit from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
}

export const celebration = Template.bind({})
celebration.args = {
  groupImpactMetric: {
    id: 'abcd',
    dollarProgress: 28e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 1 home visit from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
}
celebration.parameters = {
  chromatic: {
    disableSnapshot: true,
  },
}
celebration.decorators = [
  (Story) => {
    localstorageManager.setItem(COMPLETED_GROUP_IMPACT_VIEWS, 0)
    localstorageGroupImpactManager.setLastSeenGroupImpactMetric({
      id: 'bcde',
      dollarProgress: 28e5,
      dollarGoal: 5e6,
      impactMetric: {
        impactTitle: 'Provide 1 home visit from a community health worker',
        whyValuableDescription:
          'Community health workers provide quality health care to those who might not otherwise have access.',
      },
    })
    return <Story />
  },
]
