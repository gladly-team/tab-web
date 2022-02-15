import React from 'react'
import YahooSellNotification from './YahooSellNotification'

export default {
  title: 'Components/YahooSellNotification',
  component: YahooSellNotification,
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

const Template = (args) => <YahooSellNotification {...args} />
export const basic = Template.bind({})
basic.args = {
  userId: 'userId',
}
