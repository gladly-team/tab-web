/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  color: '#ffffff',
})

describe('FooterBlobRight component', () => {
  it('renders without error', () => {
    const FooterBlobRight = require('../FooterBlobRight').default
    expect(() => shallow(<FooterBlobRight {...getMockProps()} />)).not.toThrow()
  })

  it('sets the wave color correctly according to props', async () => {
    const mockProps = getMockProps()
    const FooterBlobRight = require('../FooterBlobRight').default
    const wrapper = shallow(<FooterBlobRight {...mockProps} />)

    expect(wrapper.find('path').first().prop('fill')).toEqual(mockProps.color)
  })
})
