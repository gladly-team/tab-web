import React from 'react'

import GroupGoalNotification from './GroupGoalNotification'

export default {
  title: 'Components/Group Impact/GroupGoalNotification',
  component: GroupGoalNotification,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <GroupGoalNotification {...args} />
export const completed = Template.bind({})
completed.args = {
  mode: 'completed',
  impactTitle: 'Fund two visits from a community healthworker',
}

export const started = Template.bind({})
started.args = {
  mode: 'started',
  impactTitle: 'Fund two visits from a community healthworker',
}
