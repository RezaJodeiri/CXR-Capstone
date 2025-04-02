module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    moduleDirectories: ['node_modules', 'src'],
    verbose: true,
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    testEnvironmentOptions: {
        url: 'http://localhost'
    },
    roots: [
        '<rootDir>',
        '<rootDir>/../../test'
    ],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1'
    },
    modulePaths: [
        '<rootDir>/node_modules',
        '<rootDir>/../../node_modules'
    ]
};