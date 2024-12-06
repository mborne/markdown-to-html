/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}'
  ],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "\\\\node_modules\\\\",
    "\\\\test\\\\"
  ],
  coverageProvider: "v8",

  // A map from regular expressions to paths to transformers
  transform: { 
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "ts-jest"
  },

  // Indicates whether each individual test should be reported during the run
  verbose: false,
};

export default config;
