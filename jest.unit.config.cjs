module.exports = {
  preset: "ts-jest",

  testEnvironment:
    "node",

  testMatch: [
    "<rootDir>/tests/unit/**/*.test.ts"
  ],

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