import React from 'react'
import { mount, shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Link from 'src/components/Link'
import Markdown from 'src/components/Markdown'

const getMockProps = () => ({
  charity: {
    name: 'Partners in Health',
    image:
      'https://dev-tab2017-media.gladly.io/img/charities/charity-post-donation-images/bwhi.jpg',
    description: `Partners In Health’s mission is to provide a preferential option for the poor in health care. By establishing long-term relationships with sister organizations based in settings of poverty, Partners In Health strives to achieve two overarching goals: to bring the benefits of modern medical science to those most in need of them and to serve as an antidote to despair.

    They draw on the resources of the world’s leading medical and academic institutions and on the lived experience of the world’s most impoverished communities. At its root, their mission is both medical and moral. It is based on solidarity, rather than charity alone.
    
    When their patients are ill and have no access to care, their team of health professionals, scholars, and activists will do whatever it takes to make them well.
    
    Partners In Health has used a community-based model to provide health care and support for the last 30 years and now serves millions of patients across 12 countries.`,
    website: 'https://www.pih.org/',
  },
})

describe('AboutTheNonprofit component', () => {
  it('renders without error', () => {
    const AboutTheNonprofit =
      require('src/components/groupImpactComponents/AboutTheNonprofit').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<AboutTheNonprofit {...mockProps} />)
    }).not.toThrow()
  })

  it('displays each impact metrics information', () => {
    const AboutTheNonprofit =
      require('src/components/groupImpactComponents/AboutTheNonprofit').default
    const mockProps = getMockProps()
    const wrapper = mount(<AboutTheNonprofit {...mockProps} />)

    const typography = wrapper.find(Typography)
    expect(typography.at(2).text()).toEqual(mockProps.charity.name)

    const markdown = wrapper.find(Markdown)
    expect(markdown.at(0).prop('children')).toEqual(
      mockProps.charity.description
    )

    expect(wrapper.find('img').first().prop('src')).toEqual(
      mockProps.charity.image
    )
    expect(wrapper.find(Link).first().prop('to')).toEqual(
      mockProps.charity.website
    )
  })
})
