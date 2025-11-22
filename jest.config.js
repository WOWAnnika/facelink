module.exports = {
    testEnvironment: "node",
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "controllers/**/*.js",
        "service/**/*.js",
        "middleware/**/*.js",
        "utils/**/*.js",
        "!**/node_modules/**"
    ],
    testMatch: ["**/*.test.js"],
    setupFilesAfterEnv: ["<rootDir>/test/setup.js"],
    testTimeout: 30000
};