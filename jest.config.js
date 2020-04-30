module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__generated__/**',
  ],
  coverageDirectory: './coverage/',
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/.yalc/', '/.git/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/jest/cssTransform.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/mediaFileTransformer.js',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '/.yalc/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}
