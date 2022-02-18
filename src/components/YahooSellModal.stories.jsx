import React from 'react'

import YahooSellModal from './YahooSellModal'

export default {
  title: 'Components/YahooSellModal',
  component: YahooSellModal,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <YahooSellModal {...args} />
export const hardSell = Template.bind({})
hardSell.args = {
  hardSell: true,
  open: true,
  userId: 'userId',
}

export const learnMore = Template.bind({})
learnMore.args = {
  hardSell: false,
  open: true,
  userId: 'userId',
}
