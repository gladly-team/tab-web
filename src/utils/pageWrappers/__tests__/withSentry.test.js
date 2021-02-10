import React from 'react'
import {
  withSentry,
  withSentrySSR,
  topLevelCatchBoundary,
} from 'src/utils/pageWrappers/withSentry'
import * as Sentry from '@sentry/node'
import { flowRight } from 'lodash/util'
import { mount } from 'enzyme'
import { useAuthUser } from 'next-firebase-auth'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import logger from 'src/utils/logger'

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

  it('doesnt set the user if there is no authd user', async () => {
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

describe('topLevelCatchBoundary', () => {
  it('catches any error in server side prop function and passes it to the logger', async () => {
    const ctx = getMockCtxWithAuthUser()
    const serverSidePropsErrorFunc = async () => {
      throw new Error('ahhh error')
    }
    await topLevelCatchBoundary(serverSidePropsErrorFunc)(ctx)
    expect(logger.error).toHaveBeenCalled()
  })

  it("doesn't throw the caught error", async () => {
    const ctx = getMockCtxWithAuthUser()
    const serverSidePropsErrorFunc = async () => {
      throw new Error('ahhh error')
    }
    await topLevelCatchBoundary(serverSidePropsErrorFunc)(ctx)
    expect(topLevelCatchBoundary).not.toThrow()
  })

  it('returns the composed props from server side function', async () => {
    const ctx = getMockCtxWithAuthUser()
    const serverSidePropsFunc = async () => ({
      sillyProp: 'sillyProp',
    })
    const composedProps = await topLevelCatchBoundary(serverSidePropsFunc)(ctx)
    expect(composedProps).toStrictEqual({ sillyProp: 'sillyProp' })
  })
})
