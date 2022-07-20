// Important: add any new env variables locally and on
// production. See .env for more info.

// TODO: remove
export const showDevelopmentOnlyDemoPages = () =>
  process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_DEMO_PAGES === 'true'

// TODO: remove
export const showMockAchievements = () =>
  process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MOCK_ACHIEVEMENTS === 'true'

// TODO: remove
export const showBackgroundImages = () => true

// TODO: revisit
// export const showDevelopmentOnlyMissionsFeature = (email = '') => {
//   if (email.includes('@tabforacause.org') || email.includes('@gladly.io')) {
//     return true
//   }
//   return process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MISSIONS_FEATURE === 'true'
// }

export const showInternalOnly = (email = '') => {
  if (email.includes('@tabforacause.org') || email.includes('@gladly.io')) {
    return true
  }
  return false
}
export const showDevelopmentOnlyMissionsFeature = () =>
  process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MISSIONS_FEATURE === 'true'
