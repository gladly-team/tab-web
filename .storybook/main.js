const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');


dotenv.config({
	path: path.resolve(__dirname, '../.env.preview.info'),
});

// From:
// https://github.com/storybookjs/storybook/issues/12270#issuecomment-1039631674
const injectVars = Object.keys(process.env).reduce((c,key) => {
  if(/^NEXT_PUBLIC_/.test(key)) {
    c[`process.env.${key}`] = JSON.stringify(process.env[key]);
  }
  return c;
}, {})

function injectEnv(definitions) {
  const env = 'process.env';
  if (!definitions[env]) {
    return {
      ...definitions,
      [env]: JSON.stringify(
        Object.fromEntries(
          Object.entries(definitions)
            .filter(([key]) => key.startsWith(env))
            .map(([key, value]) => [key.substring(env.length + 1), JSON.parse(value)]),
        ),
      ),
    };
  }
  return definitions;
}

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: (config) => {
  	// Always use the browser version of the Sentry library.
  	config.resolve.alias['@sentry/node'] = '@sentry/browser'

    config.plugins = config.plugins.reduce((c, plugin) => {

    	// Manually inject some environment variables. Otherwise,
    	// only `STORYBOOK_*` prefix env vars are supported.
    	// https://github.com/storybookjs/storybook/issues/12270#issuecomment-1039631674
      if(plugin instanceof webpack.DefinePlugin) {
        return [
          ...c,
          new webpack.DefinePlugin(
            injectEnv({
              ...plugin.definitions,
              ...injectVars,
            })
          ),
        ]
      }

      return [
        ...c,
        plugin,
      ]
    }, []);

    return config;
  },
}
