/* eslint-disable no-undef */
/* eslint-env jest */
import { isClientSide } from 'src/utils/ssr'

jest.mock('src/utils/ssr')
beforeAll(() => {
  window.fbq = jest.fn()
})

afterAll(() => {
  delete window.fbq
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('facebook-analytics tests', () => {
  test('calls FB analytics library as expected', () => {
    const fbAnalytics = require('src/utils/facebook-analytics').default
    isClientSide.mockReturnValue(true)
    fbAnalytics('some', 'event', { my: 'data' })
    expect(window.fbq).toHaveBeenCalledWith('some', 'event', { my: 'data' })
  })

  test('does not call or throw if serverside', () => {
    const fbAnalytics = require('src/utils/facebook-analytics').default
    isClientSide.mockReturnValue(false)

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})
    fbAnalytics('some', 'event', { my: 'data' })
    expect(window.fbq).not.toHaveBeenCalled()
  })

  test('a FB analytics error is caught', () => {
    window.fbq.mockImplementationOnce(() => {
      throw new Error('FB analytics oopsie')
    })
    isClientSide.mockReturnValue(true)
    const fbAnalytics = require('src/utils/facebook-analytics').default

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})
    expect(() => fbAnalytics('some', 'event')).not.toThrow()
  })
})
