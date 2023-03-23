import React from 'react'

import CauseIcon from './CauseIcon'

export default {
  title: 'Components/CauseIcon',
  component: CauseIcon,
}

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => <CauseIcon {...args} />
export const paw = Template.bind({})
paw.args = {
  icon: 'paw',
}

export const jellyfish = Template.bind({})
jellyfish.args = {
  icon: 'jellyfish',
}

export const pineTree = Template.bind({})
pineTree.args = {
  icon: 'pine-tree',
}

export const personHeart = Template.bind({})
personHeart.args = {
  icon: 'person-heart',
}

export const transgender = Template.bind({})
transgender.args = {
  icon: 'transgender',
}

export const noMatch = Template.bind({})
noMatch.args = {
  icon: undefined,
}
