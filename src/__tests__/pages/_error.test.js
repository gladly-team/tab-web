import React from 'react'
import { shallow } from 'enzyme'
import getMockRes from 'src/utils/testHelpers/mockRes'
import ErrorPageComponent from 'src/components/ErrorPage'

jest.mock('next/error')
jest.mock('@sentry/node')

const mockErr = new Error('Some mock error.')

const getMockProps = () => ({
  err: mockErr,
  statusCode: 500,
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('_error.js: render', () => {
  it('renders without error', () => {
    expect.assertions(1)
    const ErrorPage = require('src/pages/_error').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<ErrorPage {...mockProps} />)
    }).not.toThrow()
  })

  it('returns the ErrorPageComponent', () => {
    expect.assertions(1)
    const ErrorPage = require('src/pages/_error').default
    const wrapper = shallow(<ErrorPage />)
    expect(wrapper.at(0).type()).toEqual(ErrorPageComponent)
  })
})

describe('_error.js: getInitialProps', () => {
  it('returns the status code when called server-side', async () => {
    expect.assertions(1)
    const otherMockErr = new Error('Another error.')
    const ErrorPage = require('src/pages/_error').default
    const initialProps = await ErrorPage.getInitialProps({
      res: { ...getMockRes(), statusCode: 403 },
      err: otherMockErr,
      asPath: '/some-path/',
    })
    expect(initialProps).toMatchObject({
      statusCode: 403,
    })
  })

  it('returns the status code when called client-side', async () => {
    expect.assertions(1)
    const otherMockErr = new Error('Another error.')
    otherMockErr.statusCode = 500
    const ErrorPage = require('src/pages/_error').default
    const initialProps = await ErrorPage.getInitialProps({
      res: undefined, // not server-side
      err: otherMockErr,
      asPath: '/some-path/',
    })
    expect(initialProps).toMatchObject({
      statusCode: 500,
    })
  })

  it('returns a 404 status code when called client-side with no error', async () => {
    expect.assertions(1)
    const ErrorPage = require('src/pages/_error').default
    const initialProps = await ErrorPage.getInitialProps({
      res: undefined, // not server-side
      err: undefined, // no provided error
      asPath: '/some-path/',
    })
    expect(initialProps).toMatchObject({
      statusCode: 404,
    })
  })
})
