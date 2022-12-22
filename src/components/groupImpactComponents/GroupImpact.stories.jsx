import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import localstorageGroupImpactManager from 'src/utils/localstorageGroupImpactManager'
import localstorageManager from 'src/utils/localstorage-mgr'
import {
  COMPLETED_GROUP_IMPACT_VIEWS,
  CURRENT_GROUP_IMPACT_VIEWS,
} from 'src/utils/constants'
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

export const completed = Template.bind({})
completed.args = {
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
completed.decorators = [
  (Story) => {
    localstorageManager.setItem(COMPLETED_GROUP_IMPACT_VIEWS, 2)
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

export const newGoal = Template.bind({})
newGoal.args = {
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
newGoal.decorators = [
  (Story) => {
    localstorageManager.setItem(CURRENT_GROUP_IMPACT_VIEWS, 0)
    localstorageGroupImpactManager.setLastSeenGroupImpactMetric(
      newGoal.args.groupImpactMetric
    )
    return <Story />
  },
]

export const standardView = Template.bind({})
standardView.args = {
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
standardView.decorators = [
  (Story) => {
    localstorageManager.setItem(CURRENT_GROUP_IMPACT_VIEWS, 4)
    localstorageGroupImpactManager.setLastSeenGroupImpactMetric(
      newGoal.args.groupImpactMetric
    )
    return <Story />
  },
]
