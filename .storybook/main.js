const path = require('path');
const dotenv = require('dotenv');

// ----------------------------------------
// Storybook custom env var parsing

const previewDotenv = dotenv.config({
	path: path.resolve(__dirname, '../.env.preview.info'),
});

// ----------------------------------------

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: (config) => {
    config.resolve.alias['@sentry/node'] = '@sentry/browser'

    // ----------------------------------------
		// Manually inject environment variables
		// Note that otherwise, only `STORYBOOK_*` prefix env vars are supported
		// Ref: https://github.com/storybookjs/storybook/issues/12270

		const definePlugin = config.plugins.find(
			(plgn) => plgn.definitions && plgn.definitions['process.env'],
		);
		const processEnv = definePlugin.definitions['process.env'];

		/**
		 * For a given dotenv file, validate and inject its
		 * variables into the Storybook `process.env` object.
		 */
		const injectEnvVars = (envObj) => {
			const envVarsToInject = envObj.parsed;
			const hasEnvVarsToInject =
				envVarsToInject && Object.keys(envVarsToInject).length > 0;

			if (hasEnvVarsToInject) {
				Object.keys(envVarsToInject).forEach((key) => {
					processEnv[key] = JSON.stringify(envVarsToInject[key]);
				});
			}
		};

		injectEnvVars(previewDotenv);
		// ----------------------------------------

    return config
  },
}
