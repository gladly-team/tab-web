/* eslint-disable no-undef */
/* eslint-env jest */

beforeAll(() => {
  window.rdt = jest.fn()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('reddit-analytics', () => {
  test('calls Reddit analytics library as expected', () => {
    const redditAnalytics = require('src/utils/reddit-analytics').default
    redditAnalytics('track', 'SignUp')
    expect(window.rdt).toHaveBeenCalledWith('track', 'SignUp')
  })

  test('a Reddit analytics error is caught', () => {
    window.rdt.mockImplementationOnce(() => {
      throw new Error('Reddit analytics oopsie')
    })
    const redditAnalytics = require('src/utils/reddit-analytics').default

    // Suppress an expected console error
    jest.spyOn(global.console, 'error').mockImplementationOnce(() => {})

    // This would throw an error if not handled appropriately
    expect(() => redditAnalytics('track', 'PageView')).not.toThrow()
  })
})
