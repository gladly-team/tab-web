import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import AboutTheNonprofit from './AboutTheNonprofit'

export default {
  title: 'Components/Group Impact/AboutTheNonprofit',
  component: AboutTheNonprofit,
}

const useStyles = makeStyles(() => ({
  templateContainer: {
    background: blue['200'],
    height: 700,
  },
}))

// eslint-disable-next-line react/jsx-props-no-spreading
const Template = (args) => {
  const classes = useStyles()
  return (
    <div className={classes.templateContainer}>
      <AboutTheNonprofit {...args} />
    </div>
  )
}

export const list = Template.bind({})
list.args = {
  charities: [
    {
      id: '1',
      name: 'Partners in Health',
      image:
        'https://dev-tab2017-media.gladly.io/img/charities/charity-post-donation-images/bwhi.jpg',
      longformDescription: `Partners In Health’s mission is to provide a preferential option for the poor in health care. By establishing long-term relationships with sister organizations based in settings of poverty, Partners In Health strives to achieve two overarching goals: to bring the benefits of modern medical science to those most in need of them and to serve as an antidote to despair.

    They draw on the resources of the world’s leading medical and academic institutions and on the lived experience of the world’s most impoverished communities. At its root, their mission is both medical and moral. It is based on solidarity, rather than charity alone.
    
    When their patients are ill and have no access to care, their team of health professionals, scholars, and activists will do whatever it takes to make them well.
    
    Partners In Health has used a community-based model to provide health care and support for the last 30 years and now serves millions of patients across 12 countries.`,
      website: 'https://www.pih.org/',
    },
    {
      id: '2',
      name: 'Partners in Health',
      image:
        'https://dev-tab2017-media.gladly.io/img/charities/charity-post-donation-images/bwhi.jpg',
      longformDescription: `Partners In Health’s mission is to provide a preferential option for the poor in health care. By establishing long-term relationships with sister organizations based in settings of poverty, Partners In Health strives to achieve two overarching goals: to bring the benefits of modern medical science to those most in need of them and to serve as an antidote to despair.

  They draw on the resources of the world’s leading medical and academic institutions and on the lived experience of the world’s most impoverished communities. At its root, their mission is both medical and moral. It is based on solidarity, rather than charity alone.
  
  When their patients are ill and have no access to care, their team of health professionals, scholars, and activists will do whatever it takes to make them well.
  
  Partners In Health has used a community-based model to provide health care and support for the last 30 years and now serves millions of patients across 12 countries.`,
      website: 'https://www.pih.org/',
    },
  ],
}
