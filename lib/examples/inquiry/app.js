'use strict';

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _matchFactory = require('../../match/match-factory');

var _matchObservable = require('../../match/match-observable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PlayMatch = function () {
    function PlayMatch(match) {
        (0, _classCallCheck3.default)(this, PlayMatch);

        this.match = match;
        _matchObservable.matchObservable.subscribeScores(function (entity) {
            console.log(entity.constructor.name + ' score: ' + (0, _stringify2.default)(entity.scores));
        });
        _matchObservable.matchObservable.subscribeWinner(function (entity) {
            console.log(entity.constructor.name + ' winner: ' + (0, _stringify2.default)(entity.winnerId));
        });
        this.map = new _map2.default();
        this.showMainMenu = true;
        this.done = false;
        this.questions = {
            type: 'list',
            name: 'command',
            message: 'What do you want to do?',
            choices: ['a', 'b']
        };
    }

    (0, _createClass3.default)(PlayMatch, [{
        key: 'updateQuestions',
        value: function updateQuestions() {
            var _this = this;

            this.questions.choices = [];
            this.map.clear();
            if (this.showMainMenu) {
                this.map.set('play', function () {
                    return _this.showMainMenu = false;
                });
                this.map.set('quit', function () {
                    return _this.done = true;
                });
            } else {
                var commands = Array.prototype.concat([].concat((0, _toConsumableArray3.default)(this.match.setGameCommands())), [].concat((0, _toConsumableArray3.default)(this.match.matchSetCommands())), [].concat((0, _toConsumableArray3.default)(this.match.matchCommands())), [].concat((0, _toConsumableArray3.default)(this.match.otherCommands())));
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    var _loop = function _loop() {
                        var c = _step.value;

                        // this.questions.choices.push(c.title);
                        _this.map.set(c.title, function () {
                            return _this.match.commandInvoker.invoke(c);
                        });
                    };

                    for (var _iterator = (0, _getIterator3.default)(commands), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        _loop();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                this.map.set('menu', function () {
                    return _this.showMainMenu = true;
                });
            }

            [].concat((0, _toConsumableArray3.default)(this.map.keys())).forEach(function (value) {
                return _this.questions.choices.push(value);
            });
        }
    }, {
        key: 'startPlay',
        value: function startPlay() {
            this.done = false;
            this.showMainMenu = true;
            this._play();
        }
    }, {
        key: '_play',
        value: function _play() {
            var _this2 = this;

            this.updateQuestions();
            _inquirer2.default.prompt(this.questions).then(function (answers) {
                // console.log(answers);
                var fn = _this2.map.get(answers.command);
                fn();
                if (!_this2.done) {
                    _this2._play();
                }
            });
        }
    }]);
    return PlayMatch;
}();

// function play() {
//     inquirer.prompt(questions).then(function (answers) {
//         output.push(answers.tvShow);
//         if (answers.askAgain) {
//             ask();
//         } else {
//             console.log('Your favorite TV Shows:', output.join(', '));
//         }
//     });
// }

var match = _matchFactory.matchFactory.makeMatch();
var playMatch = new PlayMatch(match);
playMatch.startPlay();
//# sourceMappingURL=app.js.map