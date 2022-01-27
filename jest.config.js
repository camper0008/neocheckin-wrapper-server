/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  testPathIgnorePatterns: [
    // 'src/',
    'dist/',
  ],
  reporters: [
      "default",
    	[
        "jest-junit", 
        {
          suiteName: "jest tests"
        }
      ]
  ]
};