import React from 'react'
import { withSentry, withSentrySSR } from 'src/utils/pageWrappers/withSentry'
import * as Sentry from '@sentry/node'
import { flowRight } from 'lodash/util'
import { mount } from 'enzyme'
import { useAuthUser } from 'next-firebase-auth'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'

jest.mock('react-relay')
jest.mock('src/utils/relayEnvironment')
jest.mock('src/utils/logger', () => ({
  error: jest.fn(),
}))

const getMockCtxWithAuthUser = () => ({
  ...getMockNextJSContext(),
  AuthUser: getMockAuthUser(),
})
jest.mock('next-firebase-auth', () => ({
  useAuthUser: jest.fn(),
}))
jest.mock('@sentry/node', () => ({ setUser: jest.fn(), init: jest.fn() }))

beforeEach(() => {
  jest.clearAllMocks()
})
describe('Sentry HOC component Wrapper', () => {
  it('sets the user on the Sentry Browser when wrapping a component', async () => {
    useAuthUser.mockImplementation(() => ({
      id: 'some-id',
      email: 'some-email',
    }))
    const DummyComponent = (props) => <div {...props} />
    const WrappedHOC = flowRight([withSentry])(DummyComponent)
    await mount(<WrappedHOC />)
    expect(Sentry.setUser).toHaveBeenCalledWith({
      email: 'some-email',
      id: 'some-id',
    })
  })

  it('does not fail if AuthUser is undefined', async () => {
    useAuthUser.mockImplementation(() => ({ email: 'test' }))
    const DummyComponent = (props) => <div {...props} />
    const WrappedHOC = flowRight([withSentry])(DummyComponent)
    const WrappedComponet = await mount(<WrappedHOC />)
    expect(Sentry.setUser).not.toHaveBeenCalled()
    expect(() => WrappedComponet).not.toThrow()
  })

  it('passes along any incoming props to the child component', async () => {
    const DummyComponent = (props) => <div {...props} />
    const sillyHOC = (Child) => () => <Child sillyprop="sillyProp" />
    const WrappedHOC = flowRight([sillyHOC, withSentry])(DummyComponent)
    const WrappedComponent = mount(<WrappedHOC />)
    expect(WrappedComponent.find(DummyComponent).props()).toStrictEqual({
      sillyprop: 'sillyProp',
    })
  })
})

describe('Sentry SSRWrapper', () => {
  it('sets the user on Sentry for SSR', async () => {
    const ctx = getMockCtxWithAuthUser()
    await withSentrySSR(() => {})(ctx)
    expect(Sentry.setUser).toHaveBeenCalledWith({
      email: 'mockUser@example.com',
      id: 'mock-user-id',
    })
  })

  it("doesn't set the user if the user isn't authenticated", async () => {
    const ctx = getMockNextJSContext()
    await withSentrySSR(() => {})(ctx)
    expect(Sentry.setUser).not.toHaveBeenCalled()
  })

  it('returns the composed props from server side function', async () => {
    const ctx = getMockCtxWithAuthUser()
    const serverSidePropsFunc = async () => ({
      sillyProp: 'sillyProp',
    })
    const composedProps = await withSentrySSR(serverSidePropsFunc)(ctx)
    expect(composedProps).toStrictEqual({ sillyProp: 'sillyProp' })
  })
})
