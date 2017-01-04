'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PlayableMatch = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _matchCommand = require('./match-command');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PlayableMatch = function () {
    function PlayableMatch(match, commandStrategy, commandInvoker) {
        (0, _classCallCheck3.default)(this, PlayableMatch);

        this._match = match;
        this._commandStrategy = commandStrategy;
        this._commandInvoker = commandInvoker;
    }

    (0, _createClass3.default)(PlayableMatch, [{
        key: 'otherCommands',
        value: _regenerator2.default.mark(function otherCommands() {
            var _this = this;

            return _regenerator2.default.wrap(function otherCommands$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (!this.commandInvoker.canUndo) {
                                _context.next = 3;
                                break;
                            }

                            _context.next = 3;
                            return new _matchCommand.UndoOperation(function () {
                                return _this.commandInvoker.undo();
                            });

                        case 3:
                            if (!this.commandStrategy.matchCommandStrategy.canStartOver) {
                                _context.next = 6;
                                break;
                            }

                            _context.next = 6;
                            return new _matchCommand.StartOver(function () {
                                _this.commandStrategy.matchCommandStrategy.startOver();
                                _this.commandInvoker.clearHistory();
                            });

                        case 6:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, otherCommands, this);
        })
    }, {
        key: 'matchCommands',
        value: function matchCommands() {
            return this.commandStrategy.matchCommands();
        }
    }, {
        key: 'matchSetCommands',
        value: function matchSetCommands() {
            return this.commandStrategy.matchSetCommands();
        }
    }, {
        key: 'setGameCommands',
        value: function setGameCommands() {
            return this.commandStrategy.setGameCommands();
        }

        // invoke(command) {
        //     console.log(`invoking: ${command.title}`);
        //     this.commandInvoker.invoke(command);
        // }

    }, {
        key: 'match',
        get: function get() {
            return this._match;
        }
    }, {
        key: 'commandStrategy',
        get: function get() {
            return this._commandStrategy;
        }
    }, {
        key: 'commandInvoker',
        get: function get() {
            return this._commandInvoker;
        }
    }]);
    return PlayableMatch;
}();

exports.PlayableMatch = PlayableMatch;
//# sourceMappingURL=match-playable.js.map