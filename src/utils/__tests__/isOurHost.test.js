import isOurHost from 'src/utils/isOurHost'

describe('isOurHost', () => {
  it('returns false when it is not our domain', () => {
    expect(isOurHost('example.com')).toBe(false)
    expect(isOurHost('gladly-thing.com')).toBe(false)
  })

  it('returns true when it is our domain', () => {
    expect(isOurHost('dev-tab2017.gladly.io')).toBe(true)
    expect(isOurHost('test-tab2017.gladly.io')).toBe(true)
    expect(isOurHost('tab.gladly.io')).toBe(true)
  })
})
