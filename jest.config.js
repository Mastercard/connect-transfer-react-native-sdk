module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'react-native',
  setupFilesAfterEnv: [
    'react-native-gesture-handler/jestSetup.js',
    '@testing-library/jest-native/extend-expect',
    './jest.setup.js'
  ],
  coverageReporters: ['cobertura', 'text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 70,
      lines: 80,
      statements: 80
    }
  },
  testPathIgnorePatterns: ['/node_modules/', '/example/', '/lib/'],
  moduleNameMapper: {
    '^react-native$': '<rootDir>/node_modules/react-native'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|react-redux' +
      '|react-native-reanimated' +
      '|react-native-gesture-handler' +
      '|@react-native-community' +
      '|react-native-url-polyfill' +
      '|@reduxjs/toolkit' +
      '|immer' +
      ')/)'
  ]
};
