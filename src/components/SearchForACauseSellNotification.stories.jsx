import React from 'react'
import SearchForACauseSellNotification from './SearchForACauseSellNotification'

export default {
  title: 'Components/SearchForACauseSellNotification',
  component: SearchForACauseSellNotification,
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

const Template = (args) => <SearchForACauseSellNotification {...args} />
export const basic = Template.bind({})
basic.args = {
  userId: 'userId',
}
