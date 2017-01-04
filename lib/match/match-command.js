'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UndoOperation = exports.StartOver = exports.WinSetTiebreak = exports.WinGame = exports.WinMatchTiebreak = exports.StartSetTiebreak = exports.StartGame = exports.StartMatchTiebreak = exports.StartSet = exports.StartPlay = exports.StartWarmup = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import {MatchStrategy} from './match-commandStrategy'


var MatchCommand = function () {
    function MatchCommand(strategy) {
        (0, _classCallCheck3.default)(this, MatchCommand);

        this._commandStrategy = strategy;
    }

    (0, _createClass3.default)(MatchCommand, [{
        key: 'execute',
        value: function execute() {}
    }, {
        key: 'undo',
        value: function undo() {}
    }, {
        key: 'strategy',
        get: function get() {
            return this._commandStrategy;
        }
    }, {
        key: 'title',
        get: function get() {
            return this.constructor.name;
        }
    }]);
    return MatchCommand;
}();

var StartWarmup = function (_MatchCommand) {
    (0, _inherits3.default)(StartWarmup, _MatchCommand);

    function StartWarmup(strategy) {
        (0, _classCallCheck3.default)(this, StartWarmup);
        return (0, _possibleConstructorReturn3.default)(this, (StartWarmup.__proto__ || (0, _getPrototypeOf2.default)(StartWarmup)).call(this, strategy));
    }

    (0, _createClass3.default)(StartWarmup, [{
        key: 'execute',
        value: function execute() {
            this.strategy.startWarmup();
        }
    }, {
        key: 'undo',
        value: function undo() {
            this.strategy.undoStartWarmup();
        }
    }, {
        key: 'title',
        get: function get() {
            return 'start warmup';
        }
    }]);
    return StartWarmup;
}(MatchCommand);

var StartPlay = function (_MatchCommand2) {
    (0, _inherits3.default)(StartPlay, _MatchCommand2);

    function StartPlay(strategy, server) {
        (0, _classCallCheck3.default)(this, StartPlay);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (StartPlay.__proto__ || (0, _getPrototypeOf2.default)(StartPlay)).call(this, strategy));

        _this2._server = server;
        return _this2;
    }

    (0, _createClass3.default)(StartPlay, [{
        key: 'execute',
        value: function execute() {
            this.strategy.startPlay(this._server);
        }
    }, {
        key: 'undo',
        value: function undo() {
            this.strategy.undoStartPlay();
        }
    }, {
        key: 'server',
        get: function get() {
            return this._server;
        }
    }, {
        key: 'title',
        get: function get() {
            return 'start play ' + this.server;
        }
    }]);
    return StartPlay;
}(MatchCommand);

var WinGame = function (_MatchCommand3) {
    (0, _inherits3.default)(WinGame, _MatchCommand3);

    function WinGame(strategy, winnerId) {
        (0, _classCallCheck3.default)(this, WinGame);

        // console.log(`winner: ${winnerId}`);
        var _this3 = (0, _possibleConstructorReturn3.default)(this, (WinGame.__proto__ || (0, _getPrototypeOf2.default)(WinGame)).call(this, strategy));

        _this3._winnerId = winnerId;
        return _this3;
    }

    (0, _createClass3.default)(WinGame, [{
        key: 'execute',
        value: function execute() {
            this.strategy.winGame(this.winnerId);
        }
    }, {
        key: 'undo',
        value: function undo() {
            this.strategy.undoWinGame();
        }
    }, {
        key: 'winnerId',
        get: function get() {
            return this._winnerId;
        }
    }, {
        key: 'title',
        get: function get() {
            return 'win game ' + this.winnerId;
        }
    }]);
    return WinGame;
}(MatchCommand);

var WinSetTiebreak = function (_MatchCommand4) {
    (0, _inherits3.default)(WinSetTiebreak, _MatchCommand4);

    function WinSetTiebreak(strategy, winnerId) {
        (0, _classCallCheck3.default)(this, WinSetTiebreak);

        var _this4 = (0, _possibleConstructorReturn3.default)(this, (WinSetTiebreak.__proto__ || (0, _getPrototypeOf2.default)(WinSetTiebreak)).call(this, strategy));

        _this4._winnerId = winnerId;
        return _this4;
    }

    (0, _createClass3.default)(WinSetTiebreak, [{
        key: 'execute',
        value: function execute() {
            this.strategy.winGame(this.winnerId);
        }
    }, {
        key: 'undo',
        value: function undo() {
            this.strategy.undoWinGame();
        }
    }, {
        key: 'winnerId',
        get: function get() {
            return this._winnerId;
        }
    }, {
        key: 'title',
        get: function get() {
            return 'win set tiebreak ' + this.winnerId;
        }
    }]);
    return WinSetTiebreak;
}(MatchCommand);

var WinMatchTiebreak = function (_MatchCommand5) {
    (0, _inherits3.default)(WinMatchTiebreak, _MatchCommand5);

    function WinMatchTiebreak(strategy, winnerId) {
        (0, _classCallCheck3.default)(this, WinMatchTiebreak);

        var _this5 = (0, _possibleConstructorReturn3.default)(this, (WinMatchTiebreak.__proto__ || (0, _getPrototypeOf2.default)(WinMatchTiebreak)).call(this, strategy));

        _this5._winnerId = winnerId;
        return _this5;
    }

    (0, _createClass3.default)(WinMatchTiebreak, [{
        key: 'execute',
        value: function execute() {
            this.strategy.winGame(this.winnerId);
        }
    }, {
        key: 'undo',
        value: function undo() {
            this.strategy.undoWinGame();
        }
    }, {
        key: 'winnerId',
        get: function get() {
            return this._winnerId;
        }
    }, {
        key: 'title',
        get: function get() {
            return 'win match tiebreak ' + this.winnerId;
        }
    }]);
    return WinMatchTiebreak;
}(MatchCommand);

var StartGame = function (_MatchCommand6) {
    (0, _inherits3.default)(StartGame, _MatchCommand6);

    function StartGame(strategy, server) {
        (0, _classCallCheck3.default)(this, StartGame);

        var _this6 = (0, _possibleConstructorReturn3.default)(this, (StartGame.__proto__ || (0, _getPrototypeOf2.default)(StartGame)).call(this, strategy));

        _this6._server = server;
        return _this6;
    }

    (0, _createClass3.default)(StartGame, [{
        key: 'execute',
        value: function execute() {
            this.strategy.startGame(this._server);
        }
    }, {
        key: 'undo',
        value: function undo() {
            this.strategy.undoStartGame(this._server);
        }
    }, {
        key: 'server',
        get: function get() {
            return this._server;
        }
    }, {
        key: 'title',
        get: function get() {
            return this.server ? 'start game ' + this.server : 'start game';
        }
    }]);
    return StartGame;
}(MatchCommand);

var StartSetTiebreak = function (_MatchCommand7) {
    (0, _inherits3.default)(StartSetTiebreak, _MatchCommand7);

    function StartSetTiebreak(strategy) {
        (0, _classCallCheck3.default)(this, StartSetTiebreak);
        return (0, _possibleConstructorReturn3.default)(this, (StartSetTiebreak.__proto__ || (0, _getPrototypeOf2.default)(StartSetTiebreak)).call(this, strategy));
    }

    (0, _createClass3.default)(StartSetTiebreak, [{
        key: 'execute',
        value: function execute() {
            this.strategy.startSetTiebreak();
        }
    }, {
        key: 'undo',
        value: function undo() {
            this.strategy.undoStartSetTiebreak();
        }
    }, {
        key: 'title',
        get: function get() {
            return 'start set tiebreak';
        }
    }]);
    return StartSetTiebreak;
}(MatchCommand);

var StartMatchTiebreak = function (_MatchCommand8) {
    (0, _inherits3.default)(StartMatchTiebreak, _MatchCommand8);

    function StartMatchTiebreak(strategy, server) {
        (0, _classCallCheck3.default)(this, StartMatchTiebreak);
        return (0, _possibleConstructorReturn3.default)(this, (StartMatchTiebreak.__proto__ || (0, _getPrototypeOf2.default)(StartMatchTiebreak)).call(this, strategy));
    }

    (0, _createClass3.default)(StartMatchTiebreak, [{
        key: 'execute',
        value: function execute() {
            this.strategy.startMatchTiebreak();
        }
    }, {
        key: 'undo',
        value: function undo() {
            this.strategy.undoStartMatchTiebreak();
        }
    }, {
        key: 'title',
        get: function get() {
            return 'start match tiebreak';
        }
    }]);
    return StartMatchTiebreak;
}(MatchCommand);

var StartSet = function (_MatchCommand9) {
    (0, _inherits3.default)(StartSet, _MatchCommand9);

    function StartSet(strategy) {
        (0, _classCallCheck3.default)(this, StartSet);
        return (0, _possibleConstructorReturn3.default)(this, (StartSet.__proto__ || (0, _getPrototypeOf2.default)(StartSet)).call(this, strategy));
    }

    (0, _createClass3.default)(StartSet, [{
        key: 'execute',
        value: function execute() {
            this.strategy.startSet();
        }
    }, {
        key: 'undo',
        value: function undo() {
            this.strategy.undoStartSet();
        }
    }, {
        key: 'title',
        get: function get() {
            // TODO: Set ordinal
            return 'start set';
        }
    }]);
    return StartSet;
}(MatchCommand);

// Other commands


var UndoOperation = function () {
    function UndoOperation(fn) {
        (0, _classCallCheck3.default)(this, UndoOperation);

        this.fn = fn;
    }

    (0, _createClass3.default)(UndoOperation, [{
        key: 'execute',
        value: function execute() {
            this.fn();
        }
    }, {
        key: 'title',
        get: function get() {
            return 'undo';
        }
    }]);
    return UndoOperation;
}();

var StartOver = function () {
    function StartOver(fn) {
        (0, _classCallCheck3.default)(this, StartOver);

        this.fn = fn;
    }

    (0, _createClass3.default)(StartOver, [{
        key: 'execute',
        value: function execute() {
            this.fn();
        }
    }, {
        key: 'title',
        get: function get() {
            return 'start over';
        }
    }]);
    return StartOver;
}();

exports.StartWarmup = StartWarmup;
exports.StartPlay = StartPlay;
exports.StartSet = StartSet;
exports.StartMatchTiebreak = StartMatchTiebreak;
exports.StartGame = StartGame;
exports.StartSetTiebreak = StartSetTiebreak;
exports.WinMatchTiebreak = WinMatchTiebreak;
exports.WinGame = WinGame;
exports.WinSetTiebreak = WinSetTiebreak;
exports.StartOver = StartOver;
exports.UndoOperation = UndoOperation;
//# sourceMappingURL=match-command.js.map