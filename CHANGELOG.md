# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## v3.0.1 - 2017-10-25

### 🐛 Fixed
  * Fix params on Base route with multi-level routing

### Changed
  * Update devDependencies


## v3.0.0 - 2016-12-18

### BREAKING CHANGES
  * Removed support for Node v0.12

### 🐛 Fixed
  * Now the params set in middle of a pattern get parsed #17

### Dev
  * Move main file to `src` folder
  * Add lint script
  * Ignore editorconfig file for npm relases
  * Changed codestyle to [standard](http://standardjs.com/) #18
  * Implemented [Yarn](https://yarnpkg.com) on the project #19

### Changed
  * Add more test cases.


## v2.0.3 - 2016-11-05

### 🐛 Fixed
  * Super multi-level baseRoutes handled #10


## v2.0.1 - 2016-11-05

### Changed
  * Update dependencies
  * Fix typos in README file #6
  * Improve README file #7

### Fixed 🐛
  * Multi-level basePaths are now parsed correctly #10


## 2.0.0 - 2016-04-24

  * Implemented [Travis CI](https://travis-ci.org/) on the project. #3
  * Implemented [CodeCov](https://codecov.io/) on the project. #4
  * Now the passed arguments are the `app` or `router` instance. #5

## 1.1.1 - 2016-04-21

  * Updated dependencies
  * Now express is a development dependency
  * Improved tests


## 1.1.0 - 2016-04-20

  * Improved regexp to parse express router. #1
  * Added [editorconfig](http://editorconfig.org) file.


## 1.0.1 - 2016-01-18

  * Update package version


## 1.0.0 - 2016-01-18

  * Add changelog file
  * Improve README file


## 0.0.0 - 2016-01-18

  * Change npm test script to run mocha
  * Now getEndpoints retrieve array of object with paths and methods
  * getRouteMethods now return an array of methods
  * Tests
  * First commit
