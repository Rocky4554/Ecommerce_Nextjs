export default {
  testEnvironment: "node",
  transform: {}, // Disable Babel
  moduleFileExtensions: ["js", "mjs"],
  verbose: true,
  extensionsToTreatAsEsm: [],
  // setupFiles: ["<rootDir>/test/setupTestDB.js"],
  moduleNameMapper: {
    "^imagekit$": "<rootDir>/__mocks__/imagekit.js",
  },
  testTimeout: 30000,
};
