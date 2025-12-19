module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@domain/(.*)$": "<rootDir>/src/domain/$1",
    "^@application/(.*)$": "<rootDir>/src/application/$1",
    "^@infrastructure/(.*)$": "<rootDir>/src/infrastructure/$1",
    "^@framework/(.*)$": "<rootDir>/src/framework/$1",
    "^@adapters/(.*)$": "<rootDir>/src/adapters/$1",
    "^@shared/(.*)$": "<rootDir>/src/shared/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  setupFiles: ["dotenv/config"],
};
