import React from 'react'
import { mount } from 'enzyme'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'
// import { fetchQuery, ReactRelayContext } from 'react-relay'
// import initEnvironment from 'src/utils/createRelayEnvironment'
// import { useAuthUserInfo } from 'src/utils/auth/hooks'
import { isClientSide } from 'src/utils/ssr'

jest.mock('react-relay')
jest.mock('src/utils/createRelayEnvironment')
jest.mock('src/utils/auth/hooks') // TODO: mock me!
jest.mock('src/utils/ssr')

beforeEach(() => {
  isClientSide.mockReturnValue(false)
})

afterEach(() => {
  jest.clearAllMocks()
})

const mockRelayQueryGetter = jest.fn((wrappedComponent) => wrappedComponent)

const MockComponent = () => <div>hi</div>
MockComponent.getInitialProps = jest.fn()
MockComponent.displayName = 'MockComponent'

// Mock props for the withData HOC.
const getMockPropsForHOC = () => ({
  queryRecords: { some: 'records' },
  queryProps: { some: 'props' },
  refetchDataOnMount: false,
})

describe('withData: render', () => {
  it('contains the wrapped component', () => {
    expect.assertions(1)
    const withData = require('src/utils/pageWrappers/withData').default
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    const mockProps = getMockPropsForHOC()
    const wrapper = mount(<HOC {...mockProps} />)
    expect(wrapper.find(MockComponent).exists()).toBe(true)
  })
})

describe('withData: getInitialProps', () => {
  it("calls the wrapped component's getInitialProps with the Next.js context", async () => {
    expect.assertions(2)
    const withData = require('src/utils/pageWrappers/withData').default
    const ctx = getMockNextJSContext()
    const HOC = withData(mockRelayQueryGetter)(MockComponent)
    await HOC.getInitialProps(ctx)
    expect(MockComponent.getInitialProps).toHaveBeenCalledTimes(1)
    expect(MockComponent.getInitialProps).toHaveBeenCalledWith(ctx)
  })
})
