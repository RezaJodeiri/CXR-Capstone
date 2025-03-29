// This file is used to setup any global configurations for Jest tests

// Add any global mocks here
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests
  // error: jest.fn(),
  // warn: jest.fn(),
  // log: jest.fn(),
};

// Add any polyfills or global cleanup 