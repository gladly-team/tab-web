import React from 'react'

import ImpactCounter from './ImpactCounter'

export default {
  title: 'Components/ImpactCounter',
  component: ImpactCounter,
}

const Template = (args) => <ImpactCounter {...args} />
export const standard = Template.bind({})
standard.args = {
  includeNumber: true,
  number: 10,
  progress: 50,
}

export const full = Template.bind({})
full.args = {
  includeNumber: true,
  number: 15,
  progress: 100,
}

export const inMissionAndDisabled = Template.bind({})
inMissionAndDisabled.args = {
  includeNumber: true,
  number: 15,
  progress: 100,
  disabled: true,
}
