export default {
  testEnvironment: 'node',
  setupFiles: ['./tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  transform: {},
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
};
