/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
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

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: [
    "node_modules"
  ],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "mjs",
    //"cjs",
    //"jsx",
    "ts",
    //"tsx",
    //"json",
    //"node"
  ],

  // rootDir: undefined,

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    "src",
    "test"
  ],

  testMatch: [
    "**/?(*.)+(spec|test).[tj]s?(x)",
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   "\\\\node_modules\\\\"
  // ],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  // testRegex: [],

  // A map from regular expressions to paths to transformers
  transform: { 
    "^.+\\.tsx?$": ["ts-jest", { "rootDir": "." }],
    "^.+\\.js$": ["ts-jest", { "rootDir": "./src" }] 
  },

  /*
   * An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
   * @see https://stackoverflow.com/a/49676319
   */
  transformIgnorePatterns: [
    "node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"
  ],

  // Indicates whether each individual test should be reported during the run
  verbose: true,

};

export default config;
