/* eslint-disable @typescript-eslint/no-require-imports */
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"], // Ensure these match your folder structure
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
