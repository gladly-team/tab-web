module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-apollo-client',
  ],
  webpackFinal: (config) => {
    config.resolve.alias['@sentry/node'] = '@sentry/browser'
    return config
  },
}
