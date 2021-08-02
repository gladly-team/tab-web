import React from 'react'

import ImpactCounter from './ImpactCounter'

export default {
  title: 'Components/ImpactCounter',
  component: ImpactCounter,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <ImpactCounter {...args} />
export const standard = Template.bind({})
standard.args = {
  includeNumber: true,
  number: 10,
  progress: 50,
}

export const halfFull = Template.bind({})
halfFull.args = {
  includeNumber: true,
  number: 15,
  progress: 50,
}
