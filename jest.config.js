module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__generated__/**',
    '!**/__mocks__/**',
    '!**/__tests__/**',
    '!**/*.stories.@(js|jsx|ts|tsx)',
    '!**/.storybook/**',
  ],
  coverageDirectory: './coverage/',

  // Working around a potential memory leak that's breaking builds:
  // "MaxListenersExceededWarning: Possible EventEmitter memory leak detected."
  // https://github.com/facebook/jest/issues/7874
  maxWorkers: 1,
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setupTests.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/.yalc/', '/.git/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/jest/cssTransform.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/mediaFileTransformer.js',
  },
  transformIgnorePatterns: [
    // Transform unified, which uses exports:
    // https://github.com/unifiedjs/unified
    '/node_modules/?!(unified)',
    '/.yalc/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}
