import React from 'react'

import Markdown from './Markdown'

export default {
  title: 'Components/Markdown',
  component: Markdown,
}

const Template = (args) => <Markdown {...args} />

export const demo = Template.bind({})
demo.args = {
  children: `# This is an H1
    ## And here's an H2.
    ### I'm an H3.
    #### It's me, an H4!
    ##### Hola, soy H5.
    ###### Hey, H6 here.

    Just a humble paragraph here, followed by...

    ... another paragraph!
  `,
}
