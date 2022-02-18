import React from 'react'

import DashboardPopover from './DashboardPopover'

export default {
  title: 'Components/DashboardPopover',
  component: DashboardPopover,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <DashboardPopover {...args} />
export const standard = Template.bind({})
standard.args = {
  open: true,
  anchorEl: () => {},
  children: <div>Hello</div>,
}
