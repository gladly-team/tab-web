import { Box } from '@material-ui/core'
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
  target: '_blank',
}

const TemplateWithHandler = (args) => {
  const clickHandler = () => {
    // eslint-disable-next-line no-console
    console.log('click handler')
  }
  return (
    <Box onClick={clickHandler}>
      <Link {...args} />
    </Box>
  )
}
export const demoStopPropagation = TemplateWithHandler.bind({})
demoStopPropagation.args = {
  to: groupImpactLeaderboardFAQ,
  children: 'Hello',
  stopPropagation: true,
  target: '_blank',
}
