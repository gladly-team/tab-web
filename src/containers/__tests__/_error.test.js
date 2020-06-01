import React from 'react'
import { shallow } from 'enzyme'
import NextErrorComponent from 'next/error'
// import * as Sentry from '@sentry/node'
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
})
