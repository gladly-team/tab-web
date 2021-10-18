import React from 'react'

import testInputA from 'src/utils/testHelpers/testMarkdown-A.md'
import Markdown from './Markdown'

export default {
  title: 'Components/Markdown',
  component: Markdown,
}

const Template = (args) => <Markdown {...args} />

export const demo = Template.bind({})
demo.args = {
  children: testInputA,
}
