import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  // TODO
  demo: '100tabs',
})

describe('Achievement component', () => {
  it('renders without error', () => {
    const Achievement = require('src/components/Achievement').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<Achievement {...mockProps} />)
    }).not.toThrow()
  })
})
