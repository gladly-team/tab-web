import React from 'react'
import withGoogleAnalyticsProperties from 'src/utils/pageWrappers/withGoogleAnalyticsProperties'
import { flowRight } from 'lodash/util'
import { mount } from 'enzyme'
import { useAuthUser } from 'next-firebase-auth'
import getMockAuthUser from 'src/utils/testHelpers/getMockAuthUser'
import gtag from 'src/utils/google-analytics'

jest.mock('next-firebase-auth', () => ({
  useAuthUser: jest.fn(),
}))
jest.mock('src/utils/google-analytics')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('withGoogleAnalyticsProperties HOC component', () => {
  it('sets the Google Analytics tfac_user_id property', () => {
    expect.assertions(1)
    useAuthUser.mockReturnValueOnce({
      ...getMockAuthUser(),
      id: 'some-id-abc-def',
    })
    const DummyComponent = (props) => <div {...props} />
    const WrappedHOC = flowRight([withGoogleAnalyticsProperties])(
      DummyComponent
    )
    mount(<WrappedHOC />)
    expect(gtag).toHaveBeenCalledWith('set', 'user_properties', {
      tfac_user_id: 'some-id-abc-def',
    })
  })

  it('does not fail if AuthUser is undefined', () => {
    expect.assertions(2)
    useAuthUser.mockReturnValueOnce(undefined)
    const DummyComponent = (props) => <div {...props} />
    const WrappedHOC = flowRight([withGoogleAnalyticsProperties])(
      DummyComponent
    )
    const WrappedComponent = mount(<WrappedHOC />)
    expect(gtag).toHaveBeenCalledWith('set', 'user_properties', {})
    expect(() => WrappedComponent).not.toThrow()
  })

  it('passes along any props to the child component', () => {
    expect.assertions(1)
    const DummyComponent = (props) => <div {...props} />
    const sillyHOC = (Child) => () => <Child sillyprop="sillyProp" />
    const WrappedHOC = flowRight([sillyHOC, withGoogleAnalyticsProperties])(
      DummyComponent
    )
    const WrappedComponent = mount(<WrappedHOC />)
    expect(WrappedComponent.find(DummyComponent).props()).toStrictEqual({
      sillyprop: 'sillyProp',
    })
  })
})
