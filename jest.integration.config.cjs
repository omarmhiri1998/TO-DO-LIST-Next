module.exports = {
  preset: "ts-jest",

  testEnvironment:
    "node",

  testMatch: [
    "<rootDir>/tests/integration/**/*.test.ts"
  ],

  testTimeout:
    30000,

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          target:
            "ES2020",

          module:
            "commonjs",

          esModuleInterop:
            true
        }
      }
    ]
  }
};