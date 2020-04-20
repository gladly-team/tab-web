module.exports = {
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier', 'react-hooks'],
  rules: {
    'prettier/prettier': 'error',
    'jsx-a11y/anchor-is-valid': 0, // https://github.com/zeit/next.js/issues/5533
    'react/no-unescaped-entities': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    // The jsx-wrap-multilines rule conflicts with Prettier.
    // https://github.com/prettier/prettier/issues/1009#issuecomment-286993938
    "react/jsx-wrap-multilines": ["error", {"declaration": false, "assignment": false}],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error'
  },
  overrides: [
    // Set Jest rules only for test files.
    // https://stackoverflow.com/a/49211283
    {
      files: ['**/*.test.js'],
      'extends': ['plugin:jest/recommended'],
      env: {
        jest: true
      },
      plugins: [ 'jest' ],
      rules: {
        'global-require': 0,
        'react/jsx-props-no-spreading': 0,
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    es6: true
  },
  settings: {
    'import/resolver': {
      alias: [
        ['src', './src']
      ]
    }
  }
}
