/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  color: '#ffffff',
})

describe('FooterBlobLeft component', () => {
  it('renders without error', () => {
    const FooterBlobLeft = require('../FooterBlobLeft').default
    expect(() => shallow(<FooterBlobLeft {...getMockProps()} />)).not.toThrow()
  })

  it('sets the wave color correctly according to props', async () => {
    const mockProps = getMockProps()
    const FooterBlobLeft = require('../FooterBlobLeft').default
    const wrapper = shallow(<FooterBlobLeft {...mockProps} />)

    expect(wrapper.find('path').first().prop('fill')).toEqual(mockProps.color)
  })
})
