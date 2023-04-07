/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^src/(.*)&": "<rootDir>/src/$1",
    "^mocks/(.*)$": "<rootDir>/__mocks__/$1",
  },
  rootDir: ".",
  moduleDirectories: ["node_modules", "src"],
  testMatch: ["<rootDir>/__tests__/**/*.spec.ts"],
};
