// Important: add any new env variables to next.config.js.

export const showDevelopmentOnlyDemoPages = () => {
  // eslint-disable-next-line
  console.log('process.env.FEATURE_FLAG_DEVELOPMENT_DEMO_PAGES', process.env.FEATURE_FLAG_DEVELOPMENT_DEMO_PAGES)
  return process.env.FEATURE_FLAG_DEVELOPMENT_DEMO_PAGES === 'true'
}

export const showMockAchievements = () =>
  process.env.FEATURE_FLAG_MOCK_ACHIEVEMENTS === 'true'
