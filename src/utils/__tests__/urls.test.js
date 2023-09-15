/* eslint-env jest */
describe('Urls: constructBaseUrl', () => {
  it('returns legacy homepage if landingPagePath is undefined', () => {
    const { constructBaseUrl } = require('src/utils/urls')
    expect(constructBaseUrl()).toBe('https://tab.gladly.io/')
  })

  it('correctly appends the landingPagePath', () => {
    const { constructBaseUrl } = require('src/utils/urls')
    expect(constructBaseUrl('/cats/')).toBe('https://tab.gladly.io/cats/')
  })
})

describe('Urls: getReferralUrl', () => {
  it('returns legacy homepage referral if landingPagePath is undefined', () => {
    const { getReferralUrl } = require('src/utils/urls')
    expect(getReferralUrl('test-user')).toBe(
      'https://tab.gladly.io/?u=test-user'
    )
  })

  it('correctly appends the landingPagePath and user', () => {
    const { getReferralUrl } = require('src/utils/urls')
    expect(getReferralUrl('test-user', '/cats/')).toBe(
      'https://tab.gladly.io/cats/?u=test-user'
    )
  })
})

describe('Urls: getSquadsLink', () => {
  it('correctly appends the landingPagePath and squad id and user id', () => {
    const { getSquadsLink } = require('src/utils/urls')
    expect(getSquadsLink('test-user', '123', '/cats/')).toBe(
      'https://tab.gladly.io/cats/?u=test-user&m=123'
    )
  })
})

describe('addProtocolToURLIfNeeded', () => {
  it('appends https if applicable', () => {
    const { addProtocolToURLIfNeeded } = require('src/utils/urls')
    expect(addProtocolToURLIfNeeded('test-user')).toBe('http://test-user')
  })
})
