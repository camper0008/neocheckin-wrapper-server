/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    'archive/',
    'src/',
    // 'dist/',
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