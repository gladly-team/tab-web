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
  user: {
    id: 'bcde',
    cause: {
      groupImpactMetric: {
        id: 'abcd',
        dollarProgress: 28e5,
        dollarGoal: 5e6,
        impactMetric: {
          impactTitle: 'Provide 1 home visit from a community health worker',
          whyValuableDescription:
            'Community health workers provide quality health care to those who might not otherwise have access.',
          impactCountPerMetric: 3,
        },
      },
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
      dollarProgress: 5e6,
      dollarGoal: 5e6,
      impactMetric: {
        impactTitle: 'Provide 1 home visit from a community health worker',
        whyValuableDescription:
          'Community health workers provide quality health care to those who might not otherwise have access.',
        impactCountPerMetric: 3,
      },
    })
    return <Story />
  },
]

export const completedToNew = Template.bind({})
completedToNew.args = {
  user: {
    id: 'bcde',
    cause: {
      groupImpactMetric: {
        id: 'abcd',
        dollarProgress: 28e5,
        dollarGoal: 5e6,
        impactMetric: {
          impactTitle: 'Provide 1 home visit from a community health worker',
          whyValuableDescription:
            'Community health workers provide quality health care to those who might not otherwise have access.',
          impactCountPerMetric: 3,
        },
      },
    },
  },
}
completedToNew.decorators = [
  (Story) => {
    localstorageManager.setItem(COMPLETED_GROUP_IMPACT_VIEWS, 2)
    localstorageGroupImpactManager.setLastSeenGroupImpactMetric({
      id: 'bcde',
      dollarProgress: 5e6,
      dollarGoal: 5e6,
      impactMetric: {
        impactTitle: 'Provide 1 home visit from a community health worker',
        whyValuableDescription:
          'Community health workers provide quality health care to those who might not otherwise have access.',
        impactCountPerMetric: 3,
      },
    })
    return <Story />
  },
]

export const newGoal = Template.bind({})
newGoal.args = {
  user: {
    id: 'bcde',
    cause: {
      groupImpactMetric: {
        id: 'abcd',
        dollarProgress: 28e5,
        dollarGoal: 5e6,
        impactMetric: {
          impactTitle: 'Provide 1 home visit from a community health worker',
          whyValuableDescription:
            'Community health workers provide quality health care to those who might not otherwise have access.',
          impactCountPerMetric: 3,
        },
      },
    },
  },
}
newGoal.decorators = [
  (Story) => {
    localstorageManager.setItem(CURRENT_GROUP_IMPACT_VIEWS, 0)
    localstorageGroupImpactManager.setLastSeenGroupImpactMetric(
      newGoal.args.user.cause.groupImpactMetric
    )
    return <Story />
  },
]

export const standardView = Template.bind({})
standardView.args = {
  user: {
    id: 'bcde',
    cause: {
      groupImpactMetric: {
        id: 'abcd',
        dollarProgress: 28e5,
        dollarGoal: 5e6,
        impactMetric: {
          impactTitle: 'Provide 1 home visit from a community health worker',
          whyValuableDescription:
            'Community health workers provide quality health care to those who might not otherwise have access.',
          impactCountPerMetric: 3,
        },
        dateStarted: '2020-01-10T10:00:00.000Z',
        dateExpires: '2020-07-10T10:00:00.000Z',
      },
    },
  },
}
standardView.decorators = [
  (Story) => {
    localstorageManager.setItem(CURRENT_GROUP_IMPACT_VIEWS, 4)
    localstorageGroupImpactManager.setLastSeenGroupImpactMetric(
      standardView.args.user.cause.groupImpactMetric
    )
    return <Story />
  },
]

export const standardViewWithNoOldGoal = Template.bind({})
standardViewWithNoOldGoal.args = {
  user: {
    id: 'bcde',
    cause: {
      groupImpactMetric: {
        id: 'abcd',
        dollarProgress: 28e5,
        dollarGoal: 5e6,
        impactMetric: {
          impactTitle: 'Provide 1 home visit from a community health worker',
          whyValuableDescription:
            'Community health workers provide quality health care to those who might not otherwise have access.',
          impactCountPerMetric: 3,
        },
      },
    },
  },
}
standardViewWithNoOldGoal.decorators = [
  (Story) => {
    localstorageManager.setItem(CURRENT_GROUP_IMPACT_VIEWS, 4)
    localstorageGroupImpactManager.setLastSeenGroupImpactMetric(undefined)
    return <Story />
  },
]
