import React from 'react'
import YahooSellNotification from './YahooSellNotification'

export default {
  title: 'Components/YahooSellNotification',
  component: YahooSellNotification,
}

const Template = (args) => <YahooSellNotification {...args} />
export const basic = Template.bind({})
basic.args = {
  userId: 'userId',
}
