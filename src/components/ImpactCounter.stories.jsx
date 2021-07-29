import React from 'react'

import ImpactCounter from './ImpactCounter'

export default {
  title: 'Components/ImpactCounter',
  component: ImpactCounter,
  parameters: {
    progress: {
      values: [
        { name: 'full', value: 100 },
        { name: 'half full', value: 50 },
        { name: 'empty', value: 0 },
      ],
    },
  },
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <ImpactCounter {...args} />
export const standard = Template.bind({})
standard.args = {
  includeNumber: true,
  number: 10,
  progress: 50,
}

export const test1 = Template.bind({})
test1.args = {
  includeNumber: true,
  number: 15,
  progress: 50,
}
