import React from 'react'
import SfacActivityNotification from './SfacActivityNotification'

export default {
  title: 'Components/SfacActivityNotification',
  component: SfacActivityNotification,
}

const Template = (args) => <SfacActivityNotification {...args} />
export const active = Template.bind({})
active.args = {
  activityState: 'active',
  totalSearches: 100,
  searchesToday: 5,
}

export const inactive = Template.bind({})
inactive.args = {
  activityState: 'inactive',
  totalSearches: 100,
  searchesToday: 5,
}

export const newStatus = Template.bind({})
newStatus.args = {
  activityState: 'newStatus',
  totalSearches: 100,
  searchesToday: 5,
}
