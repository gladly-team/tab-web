module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (baseConfig) => {
    const nextConfig = require('../next.config.js')
    return { ...nextConfig.webpack, ...baseConfig }
  },
}
