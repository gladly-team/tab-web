// TODO: update comment
// Important: add any new env variables to next.config.js.

export const showDevelopmentOnlyDemoPages = () =>
  process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_DEMO_PAGES === 'true'

export const showMockAchievements = () =>
  process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MOCK_ACHIEVEMENTS === 'true'
