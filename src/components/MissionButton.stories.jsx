import React from 'react'

import MissionHubButton from './MissionHubButton'

export default {
  title: 'Components/MissionHubButton',
  component: MissionHubButton,
  parameters: {
    backgrounds: {
      default: 'black',
      values: [
        { name: 'grey', value: '#F2F2F2' },
        { name: 'black', value: '#000000' },
      ],
    },
  },
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <MissionHubButton {...args} />
export const notStarted = Template.bind({})
notStarted.args = {
  status: '',
}

export const pending = Template.bind({})
pending.args = {
  status: 'pending',
}

export const started = Template.bind({})
started.args = {
  status: 'started',
}
