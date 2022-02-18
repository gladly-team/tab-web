import React from 'react'

import SearchSelect from './SearchSelect'

export default {
  title: 'Components/SearchSelect',
  component: SearchSelect,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <SearchSelect {...args} />
export const hardSell = Template.bind({})
hardSell.args = {
  hardSell: true,
  open: true,
  userId: 'userId',
}
