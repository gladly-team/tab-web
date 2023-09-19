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
  open: true,
  mode: GROUP_IMPACT_SIDEBAR_STATE.COMPLETED,
  impactTitle: 'Fund {{count}} visits from a community healthworker',
  impactCountPerMetric: 3,
}

export const started = Template.bind({})
started.args = {
  open: true,
  mode: GROUP_IMPACT_SIDEBAR_STATE.NEW,
  impactTitle: 'Fund {{count}} visits from a community healthworker',
  impactCountPerMetric: 3,
}

export const startedWithDate = Template.bind({})
startedWithDate.args = {
  open: true,
  mode: GROUP_IMPACT_SIDEBAR_STATE.NEW,
  impactTitle: 'Fund {{count}} visits from a community healthworker',
  impactCountPerMetric: 3,
  dateStarted: '2020-01-10T10:00:00.000Z',
}

