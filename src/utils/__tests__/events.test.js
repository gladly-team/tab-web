/* eslint-env jest */

import fbq from 'src/utils/facebook-analytics'
import rdt from 'src/utils/reddit-analytics'
import gtag from 'src/utils/google-analytics'

jest.mock('src/utils/facebook-analytics')
jest.mock('src/utils/reddit-analytics')
jest.mock('src/utils/google-analytics')

afterEach(() => {
  jest.clearAllMocks()
})

describe('logEvent', () => {
  test('account created event calls analytics as expected', () => {
    const { accountCreated } = require('src/utils/events')
    accountCreated()

    expect(fbq).toHaveBeenCalledWith('track', 'CompleteRegistration', {
      content_name: 'AccountCreated',
    })
    expect(rdt).toHaveBeenCalledWith('track', 'SignUp')
    expect(gtag).toHaveBeenCalledWith('event', 'sign_up')
  })

  test('new tab view event calls analytics as expected', () => {
    const { newTabView } = require('src/utils/events')
    newTabView()

    expect(fbq).toHaveBeenCalledWith('track', 'PageView')
    expect(fbq).toHaveBeenCalledWith('track', 'ViewContent', {
      content_name: 'Newtab',
    })
    expect(rdt).not.toHaveBeenCalled()
    expect(gtag).not.toHaveBeenCalled()
  })
})
