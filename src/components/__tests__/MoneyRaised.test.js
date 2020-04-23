import React from 'react'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'

const getMockProps = () => ({
  app: {
    moneyRaised: 846892.02,
    dollarsPerDayRate: 602.12,
  },
})

beforeEach(() => {
  jest.useFakeTimers()
})

// Note: Enzyme will not call `useEffect` when shallow
// rendering, as of 23 April, 2020:
// https://github.com/enzymejs/enzyme/issues/2086
describe('MoneyRaised component', () => {
  it('renders without error', () => {
    const MoneyRaised = require('src/components/MoneyRaised').default
    const mockProps = getMockProps()
    expect(() => {
      mount(<MoneyRaised {...mockProps} />)
    }).not.toThrow()
  })

  it('increases the money raised amount at the expected rate', () => {
    const MoneyRaised = require('src/components/MoneyRaised').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        moneyRaised: 650200.12,
        dollarsPerDayRate: 1440, // a dollar per minute
      },
    }
    const wrapper = mount(<MoneyRaised {...mockProps} />)
    expect(wrapper.find('span').text()).toEqual('$650,200.12')
    act(() => jest.advanceTimersByTime(30e3)) // 30 seconds
    expect(wrapper.find('span').text()).toEqual('$650,200.62')
    act(() => jest.advanceTimersByTime(4e3)) // 4 seconds
    expect(wrapper.find('span').text()).toEqual('$650,200.68')
  })

  it('displays a two decimal places with trailing zeros', () => {
    const MoneyRaised = require('src/components/MoneyRaised').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        moneyRaised: 650200,
      },
    }
    const wrapper = mount(<MoneyRaised {...mockProps} />)
    expect(wrapper.find('span').text()).toEqual('$650,200.00')
  })

  it('updates when the app.moneyRaised prop value changes', () => {
    const MoneyRaised = require('src/components/MoneyRaised').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        moneyRaised: 871033.04,
        dollarsPerDayRate: 602.12,
      },
    }
    const wrapper = mount(<MoneyRaised {...mockProps} />)
    expect(wrapper.find('span').text()).toEqual('$871,033.04')

    // Update the moneyRaised prop value.
    wrapper.setProps({
      ...mockProps,
      app: {
        ...mockProps.app,
        moneyRaised: 900123.01,
      },
    })
    expect(wrapper.find('span').text()).toEqual('$900,123.01')
  })

  it('increases the money raised amount at the new rate when the dollarsPerDayRate changes', () => {
    const MoneyRaised = require('src/components/MoneyRaised').default
    const defaultMockProps = getMockProps()
    const mockProps = {
      ...defaultMockProps,
      app: {
        ...defaultMockProps.app,
        moneyRaised: 650200.12,
        dollarsPerDayRate: 1440, // a dollar per minute
      },
    }
    const wrapper = mount(<MoneyRaised {...mockProps} />)
    expect(wrapper.find('span').text()).toEqual('$650,200.12')
    act(() => jest.advanceTimersByTime(30e3)) // 30 seconds
    expect(wrapper.find('span').text()).toEqual('$650,200.62')

    // Update the dollarsPerDayRate.
    wrapper.setProps({
      ...mockProps,
      app: {
        ...mockProps.app,
        dollarsPerDayRate: 2880, // a dollar every 30 seconds
      },
    })

    expect(wrapper.find('span').text()).toEqual('$650,200.62')
    act(() => jest.advanceTimersByTime(30e3)) // 30 seconds
    expect(wrapper.find('span').text()).toEqual('$650,201.62')
  })
})
