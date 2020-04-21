import React from 'react'
import { shallow } from 'enzyme'

const getMockProps = () => ({
  app: {
    moneyRaised: 846892.02,
    dollarsPerDayRate: 602.12,
  },
})

// TODO: more tests
describe('MoneyRaised component', () => {
  it('renders without error', () => {
    const MoneyRaised = require('src/components/MoneyRaised').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<MoneyRaised {...mockProps} />)
    }).not.toThrow()
  })
})
