import React from 'react'
import SfacExtensionSellNotification from './SfacExtensionSellNotification'

export default {
  title: 'Components/SfacExtensionSellNotification',
  component: SfacExtensionSellNotification,
  parameters: {
    backgrounds: {
      default: 'grey',
      values: [
        { name: 'grey', value: '#F2F2F2' },
        { name: 'black', value: '#000000' },
      ],
    },
  },
}

const Template = (args) => <SfacExtensionSellNotification {...args} />
export const basic = Template.bind({})
basic.args = {
  userId: 'userId',
}
