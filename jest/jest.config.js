module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s', '!**/test/**'],
  coveragePathIgnorePatterns: [
    '/src/server.ts',
    '/src/shared/mocks/',
    '/src/shared/factory.ts',
    '/src/shared/environments.ts',
  ],
  coverageDirectory: '../coverage/unit',
  testEnvironment: 'node',
};
