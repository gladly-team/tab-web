/* eslint-env jest */

import initializeCMP from 'src/utils/initializeCMP'

jest.mock('tab-cmp')

afterEach(() => {
  jest.clearAllMocks()
})

describe('initializeCMP', () => {
  it('calls tabCMP.initializeCMP with the expected configuration', async () => {
    expect.assertions(1)
    const tabCMP = require('tab-cmp').default
    await initializeCMP()
    expect(tabCMP.initializeCMP).toHaveBeenCalledWith({
      debug: expect.any(Boolean),
      displayPersistentConsentLink: false,
      onError: expect.any(Function),
      primaryButtonColor: '#9d4ba3',
      publisherName: 'Tab for a Cause',
      publisherLogo: expect.any(String),
    })
  })
})
