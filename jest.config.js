module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/.yalc/', '/.git/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/jest/cssTransform.js',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '/.yalc/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jest/fileMock.js',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
}
