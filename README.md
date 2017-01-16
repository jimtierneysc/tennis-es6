## Tennis ES6

### Summary

ECMAScript 6 library for keeping score of a tennis match
 
### Dependencies

* Inquirer                — command line UI
* Babel                   — ES6 compiler
* Mocha, Chai, Istanbul   — testing
* Aurelia                 — dependency injection

### Download

* `git clone https://github.com/jimtierneysc/tennis-es6.git`

### Setup

```sh
$ cd tennis-es6
$ npm install
```
    
### Compile

* `npm run compile`        — compile code with source maps into lib folder
* `npm run compile:watch`  — compile code and watch for changes

### Test

* `npm run lint`           — lint the source code with ESLint
* `npm test`               — run unit tests with Mocha
* `npm run test:watch`     — run unit tests with Mocha, and watch files for changes
* `npm run test:cover`     — run unit tests with code coverage by Istanbul
* `npm run test:opencover` — open coverage report in browser (OSX)

### Example

* `npm run app`           — Run command line example
