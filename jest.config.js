const path = require("path")

module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  projects: [
    {
      displayName: "iam",
      preset: "ts-jest",
      testMatch: ["<rootDir>/apps/iam/**/*.test.ts"],
    },
    {
      displayName: "shortener",
      preset: "ts-jest",
      testMatch: ["<rootDir>/apps/shortener/**/*.test.ts"],
      moduleNameMapper: {
        "^@repo/shared(.*)$": path.join(__dirname, "./packages/shared/$1"),
      },
    },
    {
      displayName: "shared",
      preset: "ts-jest",
      testMatch: ["<rootDir>/packages/shared/**/*.test.ts"],
    },
  ],
}
