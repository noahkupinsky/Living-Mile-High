module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests', '<rootDir>/src'],
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.tests.json'
        }],
    },
    testMatch: ['**/?(*.)+(spec|test).ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};