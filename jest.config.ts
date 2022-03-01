export default {
  clearMocks: true,
  collectCoverageFrom: [
    '<rootDir>/src/core/**/*.ts',
    '!<rootDir>/src/core/errors/*.ts',
    '<rootDir>/src/database/repositories/*.ts',
    '<rootDir>/src/queue/jobs/*.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
  preset: 'ts-jest',
  modulePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/src/database/entities/index.ts',
    '<rootDir>/src/database/repositories/index.ts',
    '<rootDir>/src/core/errors/index.ts',
    '<rootDir>/src/queue/jobs/index.ts',
    '<rootDir>/src/queue/jobs/base-job.ts',
    '<rootDir>/tests/mocks/'
  ]
}
