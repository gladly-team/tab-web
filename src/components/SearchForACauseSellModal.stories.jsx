import React from 'react'

import SearchForACauseSellModal from './SearchForACauseSellModal'

export default {
  title: 'Components/SearchForACauseSellModal',
  component: SearchForACauseSellModal,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <SearchForACauseSellModal {...args} />
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
