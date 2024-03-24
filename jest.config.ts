import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: true,
	collectCoverageFrom: ['src/**'],
	coverageReporters: ['text'],
	coverageThreshold: {
		global: {
			branches: 85,
			functions: 85,
			lines: 85,
			statements: -10,
		},
	},
	moduleDirectories: ['node_modules'],
	modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
	coveragePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
	notify: true,
	clearMocks: true,
};

export default config;
