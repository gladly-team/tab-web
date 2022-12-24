import React from 'react'
import { GROUP_IMPACT_SIDEBAR_STATE } from 'src/utils/constants'

import GroupGoalNotification from './GroupGoalNotification'

export default {
  title: 'Components/Group Impact/GroupGoalNotification',
  component: GroupGoalNotification,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <GroupGoalNotification {...args} />
export const completed = Template.bind({})
completed.args = {
  mode: GROUP_IMPACT_SIDEBAR_STATE.COMPLETED,
  impactTitle: 'Fund two visits from a community healthworker',
}

export const started = Template.bind({})
started.args = {
  mode: GROUP_IMPACT_SIDEBAR_STATE.NEW,
  impactTitle: 'Fund two visits from a community healthworker',
}
