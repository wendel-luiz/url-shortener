const path = require('path')

module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  projects: [
    {
      displayName: 'iam',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/apps/iam/**/*.test.ts'],
    },
    {
      displayName: 'shortener',
      preset: 'ts-jest',
      testMatch: ['<rootDir>/apps/shortener/**/*.test.ts'],
    },
  ],
}
