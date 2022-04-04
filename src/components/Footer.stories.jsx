/* eslint-disable react/prop-types */
import React from 'react'
import Footer from './Footer'

export default {
  title: 'Components/Footer',
  component: Footer,
}

const Template = (args) => <Footer {...args} />
export const standard = Template.bind({})
standard.args = {
  onBeforeInstall: () => {},
  footerData: {
    img: 'img',
    bubbleColor: 'black',
  },
}
