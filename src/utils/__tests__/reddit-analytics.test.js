/* eslint-disable no-undef */
/* eslint-env jest */
import { isClientSide } from 'src/utils/ssr'

jest.mock('src/utils/ssr')
beforeAll(() => {
  window.rdt = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('reddit-analytics', () => {
  test('calls Reddit analytics library as expected', () => {
    const redditAnalytics = require('src/utils/reddit-analytics').default
    isClientSide.mockReturnValue(true)
    redditAnalytics('track', 'SignUp')
    expect(window.rdt).toHaveBeenCalledWith('track', 'SignUp')
  })

  test('does not call or throw if serverside', () => {
    const fbAnalytics = require('src/utils/reddit-analytics').default
    isClientSide.mockReturnValue(false)

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})
    fbAnalytics('some', 'event', { my: 'data' })
    expect(window.rdt).not.toHaveBeenCalled()
  })

  test('a Reddit analytics error is caught', () => {
    window.rdt.mockImplementationOnce(() => {
      throw new Error('Reddit analytics oopsie')
    })
    isClientSide.mockReturnValue(true)
    const redditAnalytics = require('src/utils/reddit-analytics').default

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})

    // This would throw an error if not handled appropriately
    expect(() => redditAnalytics('track', 'PageView')).not.toThrow()
  })
})
