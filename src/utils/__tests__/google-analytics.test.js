/* eslint-disable no-undef */
/* eslint-env jest */
import { isClientSide } from 'src/utils/ssr'

jest.mock('src/utils/ssr')
jest.mock('src/utils/logger')
beforeAll(() => {
  window.gtag = jest.fn()
})

afterAll(() => {
  delete window.gtag
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('google-analytics', () => {
  test('calls the GA library as expected', () => {
    const gtag = require('src/utils/google-analytics').default
    isClientSide.mockReturnValue(true)
    gtag('some', 'event', { my: 'data' })
    expect(window.gtag).toHaveBeenCalledWith('some', 'event', { my: 'data' })
  })

  test('does not call or throw if serverside', () => {
    const gtag = require('src/utils/google-analytics').default
    isClientSide.mockReturnValue(false)

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})
    gtag('some', 'event', { my: 'data' })
    expect(window.gtag).not.toHaveBeenCalled()
  })

  test('a GA error is caught', () => {
    window.gtag.mockImplementationOnce(() => {
      throw new Error('There is a proble')
    })
    isClientSide.mockReturnValue(true)
    const gtag = require('src/utils/google-analytics').default

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})
    expect(() => gtag('some', 'event')).not.toThrow()
  })
})
