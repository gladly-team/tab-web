import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import {
  GROUP_IMPACT_SIDEBAR_STATE,
  SFAC_ACTIVITY_STATES,
} from 'src/utils/constants'
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
  userId: 'bcde',
  open: true,
  groupImpactMetric: {
    dollarProgress: 28e5,
    dollarProgressFromSearch: 14e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 1 home visit from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
  groupImpactSidebarState: GROUP_IMPACT_SIDEBAR_STATE.NEW,
}

export const openTooLittle = Template.bind({})
openTooLittle.args = {
  userId: 'bcde',
  open: true,
  groupImpactMetric: {
    dollarProgress: 2e5,
    dollarProgressFromSearch: 1e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 1 home visit from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
  groupImpactSidebarState: GROUP_IMPACT_SIDEBAR_STATE.NEW,
}

export const openWithSearchUpsell = Template.bind({})
openWithSearchUpsell.args = {
  userId: 'bcde',
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
  groupImpactSidebarState: GROUP_IMPACT_SIDEBAR_STATE.NEW,
  sfacActivityState: SFAC_ACTIVITY_STATES.INACTIVE,
}

export const closed = Template.bind({})
closed.args = {
  userId: 'bcde',
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
  groupImpactSidebarState: GROUP_IMPACT_SIDEBAR_STATE.NEW,
}

export const withOldGoal = Template.bind({})
withOldGoal.args = {
  userId: 'bcde',
  open: true,
  lastGroupImpactMetric: {
    dollarProgress: 5e6,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 1 home visit from a community health worker',
      whyValuableDescription: 'Last valuable description.',
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
  groupImpactSidebarState: GROUP_IMPACT_SIDEBAR_STATE.COMPLETED,
}

export const withCount = Template.bind({})
withCount.args = {
  userId: 'bcde',
  open: true,
  groupImpactMetric: {
    dollarProgress: 10e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 2 home visits from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
  groupImpactMetricCount: 5,
  groupImpactSidebarState: GROUP_IMPACT_SIDEBAR_STATE.COMPLETED,
}

export const almostDone = Template.bind({})
almostDone.args = {
  userId: 'bcde',
  open: true,
  groupImpactMetric: {
    dollarProgress: 4.9e6,
    dollarProgressFromSearch: 4.8e6,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 2 home visits from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
  groupImpactMetricCount: 5,
  groupImpactSidebarState: GROUP_IMPACT_SIDEBAR_STATE.COMPLETED,
}

export const almostDoneTwo = Template.bind({})
almostDoneTwo.args = {
  userId: 'bcde',
  open: true,
  groupImpactMetric: {
    dollarProgress: 4.8e6,
    dollarProgressFromSearch: 1e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 2 home visits from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
  groupImpactMetricCount: 5,
  groupImpactSidebarState: GROUP_IMPACT_SIDEBAR_STATE.COMPLETED,
}

export const aboveMax = Template.bind({})
aboveMax.args = {
  userId: 'bcde',
  open: true,
  groupImpactMetric: {
    dollarProgress: 5.6e6,
    dollarProgressFromSearch: 1e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 2 home visits from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
  groupImpactMetricCount: 5,
  groupImpactSidebarState: GROUP_IMPACT_SIDEBAR_STATE.COMPLETED,
}

export const withLeaderboard = Template.bind({})
withLeaderboard.args = {
  userId: 'bcde',
  open: true,
  groupImpactMetric: {
    dollarProgress: 4.8e6,
    dollarProgressFromSearch: 1e5,
    dollarGoal: 5e6,
    impactMetric: {
      impactTitle: 'Provide 2 home visits from a community health worker',
      whyValuableDescription:
        'Community health workers provide quality health care to those who might not otherwise have access.',
    },
  },
  groupImpactMetricCount: 5,
  groupImpactSidebarState: GROUP_IMPACT_SIDEBAR_STATE.COMPLETED,
  leaderboard: [
    {
      position: 1,
      user: {
        id: 'abcd',
        username: 'cat_lover',
      },
      userGroupImpactMetric: {
        dollarContribution: 10000,
        tabDollarContribution: 1000,
        searchDollarContribution: 4000,
        shopDollarContribution: 5000,
      },
    },
    {
      position: 2,
      user: {
        id: 'bcde',
        username: 'tree_lover',
      },
      userGroupImpactMetric: {
        dollarContribution: 9000,
        tabDollarContribution: 1000,
        searchDollarContribution: 4000,
        shopDollarContribution: 4000,
      },
    },
    {
      position: 150,
      user: {
        id: 'cdef',
        username: 'its_me',
      },
      userGroupImpactMetric: {
        dollarContribution: 6120,
        tabDollarContribution: 120,
        searchDollarContribution: 3000,
        shopDollarContribution: 3000,
      },
    },
    {
      position: 151,
      user: {
        id: 'defg',
        username: 'its_not_me',
      },
      userGroupImpactMetric: {
        dollarContribution: 6000,
        tabDollarContribution: 0,
        searchDollarContribution: 3000,
        shopDollarContribution: 3000,
      },
    },
    {
      position: 152,
      user: {
        id: 'efgh',
        username: 'its_me',
      },
      userGroupImpactMetric: {
        dollarContribution: 6120,
        tabDollarContribution: 120,
        searchDollarContribution: 3000,
        shopDollarContribution: 3000,
      },
    },
    {
      position: 153,
      user: {
        id: 'fghi',
        username: 'its_not_me',
      },
      userGroupImpactMetric: {
        dollarContribution: 6000,
        tabDollarContribution: 0,
        searchDollarContribution: 3000,
        shopDollarContribution: 3000,
      },
    },
    {
      position: 154,
      user: {
        id: 'ghij',
        username: 'its_me',
      },
      userGroupImpactMetric: {
        dollarContribution: 6120,
        tabDollarContribution: 120,
        searchDollarContribution: 3000,
        shopDollarContribution: 3000,
      },
    },
    {
      position: 155,
      user: {
        id: 'hijk',
        username: 'its_not_me',
      },
      userGroupImpactMetric: {
        dollarContribution: 6000,
        tabDollarContribution: 0,
        searchDollarContribution: 3000,
        shopDollarContribution: 3000,
      },
    },
  ],
}
