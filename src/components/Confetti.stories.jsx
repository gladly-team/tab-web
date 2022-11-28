import React from 'react'

import Confetti from './Confetti'

export default {
  title: 'Components/Confetti',
  component: Confetti,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <Confetti {...args} />
export const standard = Template.bind({})
standard.args = {}
standard.parameters = {
  chromatic: {
    disableSnapshot: true,
  },
}
