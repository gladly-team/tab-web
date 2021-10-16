beforeEach(() => {
  delete process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_DEMO_PAGES
  delete process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MOCK_ACHIEVEMENTS
})

describe('feature flag: showDevelopmentOnlyDemoPages', () => {
  it('returns false when the env var is undefined', () => {
    delete process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_DEMO_PAGES
    const { showDevelopmentOnlyDemoPages } = require('src/utils/featureFlags')
    expect(showDevelopmentOnlyDemoPages()).toBe(false)
  })

  it('returns false when the env var is "false"', () => {
    process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_DEMO_PAGES = 'false'
    const { showDevelopmentOnlyDemoPages } = require('src/utils/featureFlags')
    expect(showDevelopmentOnlyDemoPages()).toBe(false)
  })

  it('returns true when the env var is "true"', () => {
    process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_DEMO_PAGES = 'true'
    const { showDevelopmentOnlyDemoPages } = require('src/utils/featureFlags')
    expect(showDevelopmentOnlyDemoPages()).toBe(true)
  })
})

describe('feature flag: showDevelopmentOnlyMissionsFeature', () => {
  it('returns false', () => {
    const {
      showDevelopmentOnlyMissionsFeature,
    } = require('src/utils/featureFlags')
    expect(showDevelopmentOnlyMissionsFeature()).toBe(false)
  })

  // Disabled for now. Will revisit squads soon.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('returns false when the env var is undefined', () => {
    delete process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MISSIONS_FEATURE
    const {
      showDevelopmentOnlyMissionsFeature,
    } = require('src/utils/featureFlags')
    expect(showDevelopmentOnlyMissionsFeature()).toBe(false)
  })

  // Disabled for now. Will revisit squads soon.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('returns false when the env var is "false"', () => {
    process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MISSIONS_FEATURE = 'false'
    const {
      showDevelopmentOnlyMissionsFeature,
    } = require('src/utils/featureFlags')
    expect(showDevelopmentOnlyMissionsFeature()).toBe(false)
  })

  // Disabled for now. Will revisit squads soon.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('returns true when the env var is "true"', () => {
    process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MISSIONS_FEATURE = 'true'
    const {
      showDevelopmentOnlyMissionsFeature,
    } = require('src/utils/featureFlags')
    expect(showDevelopmentOnlyMissionsFeature()).toBe(true)
  })

  // Disabled for now. Will revisit squads soon.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('returns true when the user email is an internal member even if the env var is false"', () => {
    process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MISSIONS_FEATURE = 'false'
    const {
      showDevelopmentOnlyMissionsFeature,
    } = require('src/utils/featureFlags')
    expect(showDevelopmentOnlyMissionsFeature('alec@tabforacause.org')).toBe(
      true
    )
  })
})

describe('feature flag: showMockAchievements', () => {
  it('returns false when the env var is undefined', () => {
    delete process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MOCK_ACHIEVEMENTS
    const { showMockAchievements } = require('src/utils/featureFlags')
    expect(showMockAchievements()).toBe(false)
  })

  it('returns false when the env var is "false"', () => {
    process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MOCK_ACHIEVEMENTS = 'false'
    const { showMockAchievements } = require('src/utils/featureFlags')
    expect(showMockAchievements()).toBe(false)
  })

  it('returns true when the env var is "true"', () => {
    process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MOCK_ACHIEVEMENTS = 'true'
    const { showMockAchievements } = require('src/utils/featureFlags')
    expect(showMockAchievements()).toBe(true)
  })
})

describe('feature flag: showBackgroundImages', () => {
  it('returns false when the env var is undefined', () => {
    delete process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_BACKGROUND_IMAGES
    const { showBackgroundImages } = require('src/utils/featureFlags')
    expect(showBackgroundImages()).toBe(false)
  })

  it('returns false when the env var is "false"', () => {
    process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_BACKGROUND_IMAGES = 'false'
    const { showBackgroundImages } = require('src/utils/featureFlags')
    expect(showBackgroundImages()).toBe(false)
  })

  it('returns true when the env var is "true"', () => {
    process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_BACKGROUND_IMAGES = 'true'
    const { showBackgroundImages } = require('src/utils/featureFlags')
    expect(showBackgroundImages()).toBe(true)
  })
})
