import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  onSuccessfulAuth: undefined,
})

// TODO: more tests
describe('FirebaseAuth component', () => {
  it('renders without error', () => {
    const FirebaseAuth = require('src/components/FirebaseAuth').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<FirebaseAuth {...mockProps} />)
    }).not.toThrow()
  })
})
