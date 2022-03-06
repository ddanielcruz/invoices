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
    'index.ts',
    '<rootDir>/dist/',
    '<rootDir>/src/queue/jobs/base-job.ts',
    '<rootDir>/tests/mocks/'
  ]
}
