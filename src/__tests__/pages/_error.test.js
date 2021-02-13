import React from 'react'
import { shallow } from 'enzyme'
import { getServerSideProps as NextErrGetSSP } from 'next/error'
import * as Sentry from '@sentry/node'
import getMockRes from 'src/utils/testHelpers/mockRes'
import ErrorPageComponent from 'src/components/ErrorPage'

jest.mock('next/error')
jest.mock('@sentry/node')

const mockErr = new Error('Some mock error.')

const getMockProps = () => ({
  err: mockErr,
  hasGetServerSidePropsRun: true,
  statusCode: 500,
})

beforeEach(() => {
  NextErrGetSSP.mockResolvedValue({
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
    const ErrorPage = require('src/pages/_error.js').default
    const mockProps = getMockProps()
    expect(() => {
      shallow(<ErrorPage {...mockProps} />)
    }).not.toThrow()
  })

  it('returns the ErrorPageComponent', () => {
    expect.assertions(1)
    const ErrorPage = require('src/pages/_error.js').default
    const wrapper = shallow(<ErrorPage />)
    expect(wrapper.at(0).type()).toEqual(ErrorPageComponent)
  })

  it('logs an error if "hasGetServerSidePropsRun" is false (we have not yet logged an error)', () => {
    expect.assertions(1)
    const ErrorPage = require('src/pages/_error.js').default
    const mockProps = {
      ...getMockProps(),
      hasGetServerSidePropsRun: false,
    }
    shallow(<ErrorPage {...mockProps} />)
    expect(Sentry.captureException).toHaveBeenCalledWith(mockErr)
  })

  it('does not log an error if "hasGetServerSidePropsRun" is true (we already logged an error in getServerSideProps)', () => {
    expect.assertions(1)
    const ErrorPage = require('src/pages/_error.js').default
    const mockProps = {
      ...getMockProps(),
      hasGetServerSidePropsRun: true,
    }
    shallow(<ErrorPage {...mockProps} />)
    expect(Sentry.captureException).not.toHaveBeenCalled()
  })
})

describe('_error.js: getServerSideProps', () => {
  it("returns the NextErrorComponent's initialProps, plus the hasGetServerSidePropsRun prop", async () => {
    expect.assertions(1)
    const otherMockErr = new Error('Another error.')
    NextErrGetSSP.mockResolvedValue({
      statusCode: 403,
      err: otherMockErr,
    })
    const { getServerSideProps } = require('src/pages/_error.js')
    const initialProps = await getServerSideProps({
      res: getMockRes(),
      err: otherMockErr,
      asPath: '/some-path/',
    })
    expect(initialProps).toMatchObject({
      hasGetServerSidePropsRun: true,
      err: otherMockErr,
      statusCode: 403,
    })
  })

  it("throws if NextErrorComponent's `getServerSideProps` throws", async () => {
    expect.assertions(1)
    const unrelatedErr = new Error('Some unrelated error!')
    NextErrGetSSP.mockRejectedValue(unrelatedErr)
    const { getServerSideProps } = require('src/pages/_error.js')
    await expect(
      getServerSideProps({
        res: getMockRes(),
        err: mockErr,
        asPath: '/some-path/',
      })
    ).rejects.toEqual(unrelatedErr)
  })

  it('logs an error to Sentry', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/_error.js')
    await getServerSideProps({
      res: getMockRes(),
      err: mockErr,
      asPath: '/some-path/',
    })
    expect(Sentry.captureException).toHaveBeenCalledWith(mockErr)
  })

  it('does not log an error for a 404 status code', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/_error.js')
    await getServerSideProps({
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
    const { getServerSideProps } = require('src/pages/_error.js')
    await getServerSideProps({
      res: getMockRes(),
      err: undefined,
      asPath: '/some-path/',
    })
    expect(Sentry.captureException).toHaveBeenCalledWith(
      new Error(
        '_error.js getServerSideProps missing data at path: /some-path/'
      )
    )
  })

  it('does not throw if "res" is not defined (getServerSideProps called on the client)', async () => {
    expect.assertions(1)
    const { getServerSideProps } = require('src/pages/_error.js')
    await expect(
      getServerSideProps({
        res: undefined,
        err: mockErr,
        asPath: '/some-path/',
      })
    ).resolves.not.toThrow()
  })
})
