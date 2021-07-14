/* eslint-disable import/extensions */
const defaultConfig = require('./jest.config.js');

module.exports = {
  ...defaultConfig,
  testRegex: '.*\\.int-spec\\.ts$',
  coverageDirectory: '../coverage/int',
};
