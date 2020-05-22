beforeEach(() => {
  process.env.FEATURE_FLAG_DEVELOPMENT_DEMO_PAGES = undefined
  process.env.FEATURE_FLAG_MOCK_ACHIEVEMENTS = undefined
})

describe('feature flag: showDevelopmentOnlyDemoPages', () => {
  it('returns false when the env var is undefined', () => {
    process.env.FEATURE_FLAG_DEVELOPMENT_DEMO_PAGES = undefined
    const { showDevelopmentOnlyDemoPages } = require('src/utils/featureFlags')
    expect(showDevelopmentOnlyDemoPages()).toBe(false)
  })

  it('returns false when the env var is "false"', () => {
    process.env.FEATURE_FLAG_DEVELOPMENT_DEMO_PAGES = 'false'
    const { showDevelopmentOnlyDemoPages } = require('src/utils/featureFlags')
    expect(showDevelopmentOnlyDemoPages()).toBe(false)
  })

  it('returns true when the env var is "true"', () => {
    process.env.FEATURE_FLAG_DEVELOPMENT_DEMO_PAGES = 'true'
    const { showDevelopmentOnlyDemoPages } = require('src/utils/featureFlags')
    expect(showDevelopmentOnlyDemoPages()).toBe(true)
  })
})

describe('feature flag: showMockAchievements', () => {
  it('returns false when the env var is undefined', () => {
    process.env.FEATURE_FLAG_MOCK_ACHIEVEMENTS = undefined
    const { showMockAchievements } = require('src/utils/featureFlags')
    expect(showMockAchievements()).toBe(false)
  })

  it('returns false when the env var is "false"', () => {
    process.env.FEATURE_FLAG_MOCK_ACHIEVEMENTS = 'false'
    const { showMockAchievements } = require('src/utils/featureFlags')
    expect(showMockAchievements()).toBe(false)
  })

  it('returns true when the env var is "true"', () => {
    process.env.FEATURE_FLAG_MOCK_ACHIEVEMENTS = 'true'
    const { showMockAchievements } = require('src/utils/featureFlags')
    expect(showMockAchievements()).toBe(true)
  })
})
