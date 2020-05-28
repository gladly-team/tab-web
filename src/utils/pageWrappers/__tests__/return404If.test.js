import React from 'react'
import { mount } from 'enzyme'
import ErrorPage from 'next/error'
import getMockNextJSContext from 'src/utils/testHelpers/getMockNextJSContext'

jest.mock('next/error')

// A mock component that serves as the wrapped child of the
// HOC we're testing.
const MockComponent = () => <div>hi</div>
MockComponent.getInitialProps = jest.fn(() => Promise.resolve())
MockComponent.displayName = 'MockComponent'

const getMockPropsForHOC = () => ({
  is404: true,
  composedInitialProps: {},
})

beforeEach(() => {
  MockComponent.getInitialProps.mockResolvedValue({})
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('return404If: render', () => {
  it('returns the child component if "should404" is false', () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const HOC = return404If(false)(MockComponent)
    const mockProps = {
      ...getMockPropsForHOC(),
      is404: false,
    }
    const wrapper = mount(<HOC {...mockProps} />)
    expect(wrapper.find(MockComponent).exists()).toBe(true)
  })

  it('passes the "composedInitialProps" to the the child component if "should404" is false', () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const HOC = return404If(false)(MockComponent)
    const mockProps = {
      ...getMockPropsForHOC(),
      is404: false,
      composedInitialProps: {
        my: 'props',
        abc: 123,
      },
    }
    const wrapper = mount(<HOC {...mockProps} />)
    expect(wrapper.find(MockComponent).props()).toEqual({
      my: 'props',
      abc: 123,
    })
  })

  it('does not return the 404 page if "should404" is false', () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const HOC = return404If(false)(MockComponent)
    const mockProps = {
      ...getMockPropsForHOC(),
      is404: false,
    }
    const wrapper = mount(<HOC {...mockProps} />)
    expect(wrapper.find(ErrorPage).exists()).toBe(false)
  })

  it('returns the 404 page if "should404" is true', () => {
    expect.assertions(2)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const HOC = return404If(true)(MockComponent)
    const mockProps = {
      ...getMockPropsForHOC(),
      is404: true,
    }
    const wrapper = mount(<HOC {...mockProps} />)
    expect(wrapper.find(ErrorPage).exists()).toBe(true)
    expect(wrapper.find(ErrorPage).prop('statusCode')).toEqual(404)
  })

  it('does not returns child component if "should404" is true', () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const HOC = return404If(true)(MockComponent)
    const mockProps = {
      ...getMockPropsForHOC(),
      is404: true,
    }
    const wrapper = mount(<HOC {...mockProps} />)
    expect(wrapper.find(MockComponent).exists()).toBe(false)
  })
})

describe('return404If: getInitialProps', () => {
  it('calls the wrapped component\'s getInitialProps if "should404" is false', async () => {
    expect.assertions(2)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const ctx = getMockNextJSContext()
    const HOC = return404If(false)(MockComponent)
    await HOC.getInitialProps(ctx)
    expect(MockComponent.getInitialProps).toHaveBeenCalledTimes(1)
    expect(MockComponent.getInitialProps).toHaveBeenCalledWith(ctx)
  })

  it('does not call the wrapped component\'s getInitialProps if "should404" is true', async () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const ctx = getMockNextJSContext()
    const HOC = return404If(true)(MockComponent)
    await HOC.getInitialProps(ctx)
    expect(MockComponent.getInitialProps).not.toHaveBeenCalled()
  })

  it('returns the wrapped component\'s getInitialProps as composedInitialProps if "should404" is false', async () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const ctx = getMockNextJSContext()
    MockComponent.getInitialProps.mockResolvedValue({ some: 'things' })
    const HOC = return404If(false)(MockComponent)
    const initialProps = await HOC.getInitialProps(ctx)
    expect(initialProps).toEqual({
      is404: false,
      composedInitialProps: { some: 'things' },
    })
  })

  it('returns empty composedInitialProps if "should404" is true', async () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const ctx = getMockNextJSContext()
    MockComponent.getInitialProps.mockResolvedValue({ some: 'things' }) // shouldn't be called
    const HOC = return404If(true)(MockComponent)
    const initialProps = await HOC.getInitialProps(ctx)
    expect(initialProps).toEqual({
      is404: true,
      composedInitialProps: {},
    })
  })

  it('sets the status code to 404 if "should404" is true', async () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const ctx = getMockNextJSContext()
    MockComponent.getInitialProps.mockResolvedValue({ some: 'things' }) // shouldn't be called
    const HOC = return404If(true)(MockComponent)
    await HOC.getInitialProps(ctx)
    expect(ctx.res.statusCode).toEqual(404)
  })

  it('returns a 200 status code if "should404" is false', async () => {
    expect.assertions(1)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const ctx = getMockNextJSContext()
    MockComponent.getInitialProps.mockResolvedValue({ some: 'things' }) // shouldn't be called
    const HOC = return404If(false)(MockComponent)
    await HOC.getInitialProps(ctx)
    expect(ctx.res.statusCode).toEqual(200)
  })

  it('does not throw with a client-side context object', async () => {
    expect.assertions(0)
    const return404If = require('src/utils/pageWrappers/return404If').default
    const ctx = getMockNextJSContext({ serverSide: false })
    MockComponent.getInitialProps.mockResolvedValue({ some: 'things' }) // shouldn't be called
    const HOC = return404If(false)(MockComponent)
    await HOC.getInitialProps(ctx)
  })
})
