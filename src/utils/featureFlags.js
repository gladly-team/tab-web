// Important: add any new env variables to next.config.js.

export const showDevelopmentOnlyDemoPages = () =>
  process.env.FEATURE_FLAG_DEVELOPMENT_DEMO_PAGES === 'true'

export const showMockAchievements = () =>
  process.env.FEATURE_FLAG_MOCK_ACHIEVEMENTS === 'true'
