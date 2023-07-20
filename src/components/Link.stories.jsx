import React from 'react'

import { groupImpactLeaderboardFAQ } from 'src/utils/urls'
import Link from './Link'

export default {
  title: 'Components/Link',
  component: Link,
}

const Template = (args) => <Link {...args} />

export const demo = Template.bind({})
demo.args = {
  to: groupImpactLeaderboardFAQ,
  children: 'Hello',
  stopPropagation: true,
  target: '_blank',
}

export const demoWithProp = Template.bind({})
demoWithProp.args = {
  to: groupImpactLeaderboardFAQ,
  children: 'Hello',
  target: '_blank',
}
