/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  esModuleInterop: true,
  // 指定ts config文件
  tsconfig: '<rootDir>/tsconfig.json',
  // 使用esm而非commonjs
  useESM: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};
