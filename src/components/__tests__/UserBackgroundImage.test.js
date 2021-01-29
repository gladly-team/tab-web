import React from 'react'
import { mount } from 'enzyme'

const getMockProps = () => ({
  user: {
    backgroundImage: {
      imageUrl: 'randomstringurl',
      timestamp: 'randomtimestamp',
    },
    id: 'randomID',
  },
})

describe('UserBackgroundImage component', () => {
  it('renders without error', () => {
    const UserBackgroundImage = require('src/components/UserBackgroundImage')
      .default
    const mockProps = getMockProps()
    expect(() => {
      mount(<UserBackgroundImage {...mockProps} />)
    }).not.toThrow()
  })
})
