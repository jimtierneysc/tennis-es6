/**
 * Recursive prompt example
 * Allows user to choose when to exit prompt
 */

'use strict';
// var inquirer = require('in' +
//     'quirer');

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var output = [];


var questions = [{
    type: 'input',
    name: 'tvShow',
    message: 'What\'s your favorite TV show?'
}, {
    type: 'confirm',
    name: 'askAgain',
    message: 'Want to enter another TV show favorite (just hit enter for YES)?',
    default: true
}];

function ask() {
    _inquirer2.default.prompt(questions).then(function (answers) {
        output.push(answers.tvShow);
        if (answers.askAgain) {
            ask();
        } else {
            console.log('Your favorite TV Shows:', output.join(', '));
        }
    });
}

ask();
//# sourceMappingURL=start-match.js.map