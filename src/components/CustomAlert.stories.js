import React from 'react'

import CustomAlert from './CustomAlert'

export default {
  title: 'Components/CustomAlert',
  component: CustomAlert,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <CustomAlert {...args} />
export const star = Template.bind({})
star.args = {
  text: 'this is a custom alert',
}

export const done = Template.bind({})
done.args = {
  text: 'this is a custom alert with a done icon',
  icon: 'done',
}
