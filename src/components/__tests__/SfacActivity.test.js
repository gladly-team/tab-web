import React from 'react'
import { mount } from 'enzyme'

// import SfacActivityButton from 'src/components/SfacActivityButton'
// import SfacActivityNotification from 'src/components/SfacActivityNotification'

jest.mock('src/components/SfacActivityButton', () => {
  const { forwardRef } = jest.requireActual('react')
  return {
    __esModule: true,

    // Prevent React complaining about calling `forwardRef` on a
    // mock function.
    default: forwardRef((props, ref) => <div ref={ref} />),
  }
})
jest.mock('src/components/SfacActivityNotification', () => () => <div />)

const getMockProps = () => ({
  user: {
    cause: {
      name: 'Trees',
    },
    searches: 43,
    searchesToday: 6,
    sfacActivityState: 'active',
  },
})

afterEach(() => {
  jest.clearAllMocks()
})

// TODO: more tests
describe('SfacActivity', () => {
  it('renders without error', () => {
    const SfacActivity = require('src/components/SfacActivity').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<SfacActivity {...mockProps} />)
    }).not.toThrow()
  })
})
