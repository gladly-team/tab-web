import React from 'react'
import { shallow } from 'enzyme'
import Typography from '@material-ui/core/Typography'
import Logo from 'src/components/Logo'
import FirebaseAuth from 'src/components/FirebaseAuth'
import MoneyRaisedContainer from 'src/components/MoneyRaisedContainer'
import useData from 'src/utils/hooks/useData'

jest.mock('src/utils/pageWrappers/withRelay')
jest.mock('src/components/FirebaseAuth', () => () => (
  <div data-test-id="firebase-auth-mock" />
))
jest.mock('src/components/FullPageLoader', () => () => (
  <div data-test-id="full-page-loader-mock" />
))
jest.mock('src/components/FullPageLoader', () => () => (
  <div data-test-id="full-page-loader-mock" />
))
jest.mock('src/components/Logo')
jest.mock('src/utils/pageWrappers/withSentry')
jest.mock('src/utils/hooks/useData')

const getMockProps = () => ({
  data: {
    app: {
      moneyRaised: 846892.02,
      dollarsPerDayRate: 602.12,
    },
  },
})

beforeEach(() => {
  useData.mockReturnValue({ data: getMockProps().data })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('auth.js', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<AuthPage {...mockProps} />)
    }).not.toThrow()
  })

  it('includes the logo', async () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AuthPage {...mockProps} />)
    expect(wrapper.find(Logo).exists()).toBe(true)
  })

  it('includes the expected quote', async () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AuthPage {...mockProps} />)
    expect(wrapper.find(Typography).at(1).text()).toEqual(
      '"One of the simplest ways to raise money"'
    )
  })

  it('includes the expected quote attribution', async () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AuthPage {...mockProps} />)
    expect(wrapper.find(Typography).last().text()).toEqual('- USA Today')
  })

  it('includes the FirebaseAuth component', async () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AuthPage {...mockProps} />)
    expect(wrapper.find(FirebaseAuth).exists()).toBe(true)
  })

  it('includes the MoneyRaisedContainer component', async () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<AuthPage {...mockProps} />)
    expect(wrapper.find(MoneyRaisedContainer).exists()).toBe(true)
  })

  it('passes the expected getRelayQuery function to `useData`', async () => {
    expect.assertions(1)
    const AuthPage = require('src/pages/auth.js').default
    const mockProps = {
      ...getMockProps(),
      data: { ...getMockProps().data, some: 'stuff' },
    }
    shallow(<AuthPage {...mockProps} />)
    const useDataArg = useData.mock.calls[0][0]
    const queryInfo = await useDataArg.getRelayQuery()
    expect(queryInfo).toMatchObject({
      query: expect.any(Object),
    })
  })
})
