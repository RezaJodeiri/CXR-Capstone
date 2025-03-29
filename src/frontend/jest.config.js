module.exports = {
    testEnvironment: 'jsdom',
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    moduleDirectories: ['node_modules', 'src'],
    verbose: true,
    setupFiles: ['<rootDir>/jestSetup.js'],
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    roots: [
        '<rootDir>',
        '<rootDir>/../../test'
    ],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    },
    modulePaths: [
        '<rootDir>/node_modules',
        '<rootDir>/../../node_modules'
    ],
    testPathIgnorePatterns: ['/node_modules/'],
    transformIgnorePatterns: [
        '/node_modules/(?!axios)/'
    ]
};