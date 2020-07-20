import React from 'react'
import { shallow } from 'enzyme'
import NextErrorComponent from 'next/error'
import * as Sentry from '@sentry/node'
import getMockRes from 'src/utils/testHelpers/mockRes'

jest.mock('next/error')
jest.mock('@sentry/node')

const mockErr = new Error('Some mock error.')

const getMockProps = () => ({
  err: mockErr,
  hasGetInitialPropsRun: true,
  statusCode: 500,
})

beforeEach(() => {
  NextErrorComponent.getInitialProps.mockResolvedValue({
    statusCode: 500,
    err: mockErr,
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('_error.js: render', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const ErrorPage = require('src/containers/_error.js').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<ErrorPage {...mockProps} />)
    }).not.toThrow()
  })

  it('returns the NextErrorComponent', () => {
    expect.assertions(1)
    const ErrorPage = require('src/containers/_error.js').default
    const mockProps = getMockProps()
    const wrapper = shallow(<ErrorPage {...mockProps} />)
    expect(wrapper.at(0).type()).toEqual(NextErrorComponent)
  })

  it('passes the status code to the NextErrorComponent', () => {
    expect.assertions(1)
    const ErrorPage = require('src/containers/_error.js').default
    const mockProps = {
      ...getMockProps(),
      statusCode: 403,
    }
    const wrapper = shallow(<ErrorPage {...mockProps} />)
    expect(wrapper.find(NextErrorComponent).prop('statusCode')).toEqual(403)
  })

  it('logs an error if "hasGetInitialPropsRun" is false (we have not yet logged an error)', () => {
    expect.assertions(1)
    const ErrorPage = require('src/containers/_error.js').default
    const mockProps = {
      ...getMockProps(),
      hasGetInitialPropsRun: false,
    }
    shallow(<ErrorPage {...mockProps} />)
    expect(Sentry.captureException).toHaveBeenCalledWith(mockErr)
  })

  it('does not log an error if "hasGetInitialPropsRun" is true (we already logged an error in getInitialProps)', () => {
    expect.assertions(1)
    const ErrorPage = require('src/containers/_error.js').default
    const mockProps = {
      ...getMockProps(),
      hasGetInitialPropsRun: true,
    }
    shallow(<ErrorPage {...mockProps} />)
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })
})

describe('_error.js: getInitialProps', () => {
  it("returns the NextErrorComponent's initialProps, plus the hasGetInitialPropsRun prop", async () => {
    expect.assertions(1)
    const otherMockErr = new Error('Another error.')
    NextErrorComponent.getInitialProps.mockResolvedValue({
      statusCode: 403,
      err: otherMockErr,
    })
    const ErrorPage = require('src/containers/_error.js').default
    const initialProps = await ErrorPage.getInitialProps({
      res: getMockRes(),
      err: otherMockErr,
      asPath: '/some-path/',
    })
    expect(initialProps).toMatchObject({
      hasGetInitialPropsRun: true,
      err: otherMockErr,
      statusCode: 403,
    })
  })

  it('throws if NextErrorComponent.getInitialProps throws', async () => {
    expect.assertions(1)
    const unrelatedErr = new Error('Some unrelated error!')
    NextErrorComponent.getInitialProps.mockRejectedValue(unrelatedErr)
    const ErrorPage = require('src/containers/_error.js').default
    await expect(
      ErrorPage.getInitialProps({
        res: getMockRes(),
        err: mockErr,
        asPath: '/some-path/',
      })
    ).rejects.toEqual(unrelatedErr)
  })

  it('logs an error to Sentry', async () => {
    expect.assertions(1)
    const ErrorPage = require('src/containers/_error.js').default
    await ErrorPage.getInitialProps({
      res: getMockRes(),
      err: mockErr,
      asPath: '/some-path/',
    })
    expect(Sentry.captureException).toHaveBeenCalledWith(mockErr)
  })

  it('does not log an error for a 404 status code', async () => {
    expect.assertions(1)
    const ErrorPage = require('src/containers/_error.js').default
    await ErrorPage.getInitialProps({
      res: {
        ...getMockRes(),
        statusCode: 404,
      },
      err: mockErr,
      asPath: '/some-path/',
    })
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })

  it('logs an error to Sentry when there is no "err" object', async () => {
    expect.assertions(1)
    const ErrorPage = require('src/containers/_error.js').default
    await ErrorPage.getInitialProps({
      res: getMockRes(),
      err: undefined,
      asPath: '/some-path/',
    })
    expect(Sentry.captureException).toHaveBeenCalledWith(
      new Error('_error.js getInitialProps missing data at path: /some-path/')
    )
  })

  it('does not throw if "res" is not defined (getInitialProps called on the client)', async () => {
    expect.assertions(1)
    const ErrorPage = require('src/containers/_error.js').default
    await expect(
      ErrorPage.getInitialProps({
        res: undefined,
        err: mockErr,
        asPath: '/some-path/',
      })
    ).resolves.not.toThrow()
  })
})
