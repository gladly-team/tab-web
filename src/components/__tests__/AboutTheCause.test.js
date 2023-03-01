import React from 'react'
import { shallow } from 'enzyme'
import Markdown from 'src/components/Markdown'

const getMockProps = () => ({
  cause: {
    about: '### Something Here\n\nWith some other content.',
  },
})

describe('AboutTheCause component', () => {
  it('renders without error', () => {
    const AboutTheCause = require('src/components/AboutTheCause').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<AboutTheCause {...mockProps} />)
    }).not.toThrow()
  })

  it('renders child content within a Markdown component when the fetch has completed', () => {
    const AboutTheCause = require('src/components/AboutTheCause').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AboutTheCause {...mockProps} />)
    expect(wrapper.find(Markdown).prop('children')).toEqual(
      '### Something Here\n\nWith some other content.'
    )
  })
})
