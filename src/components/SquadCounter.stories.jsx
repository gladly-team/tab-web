import React from 'react'

import SquadCounter from './SquadCounter'

export default {
  title: 'Components/SquadCounter',
  component: SquadCounter,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <SquadCounter {...args} />
export const standard = Template.bind({})
standard.args = {
  progress: 50,
}

export const full = Template.bind({})
full.args = {
  progress: 100,
}
