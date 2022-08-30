import React from 'react'
import SfacActivityButton from './SfacActivityButton'

export default {
  title: 'Components/SfacActivityButton',
  component: SfacActivityButton,
}

const Template = (args) => <SfacActivityButton {...args} />
export const active = Template.bind({})
active.args = {
  active: true,
}

export const inactive = Template.bind({})
inactive.args = {
  active: false,
}
