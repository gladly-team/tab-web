// Important: add any new env variables locally and on
// production. See .env for more info.

export const showDevelopmentOnlyDemoPages = () =>
  process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_DEMO_PAGES === 'true'

export const showMockAchievements = () =>
  process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_MOCK_ACHIEVEMENTS === 'true'

export const showBackgroundImages = () =>
  process.env.NEXT_PUBLIC_DEVELOPMENT_SHOW_BACKGROUND_IMAGES === 'true'

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
