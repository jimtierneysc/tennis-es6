'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.matchObservable = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MatchObservable = function () {
    function MatchObservable() {
        (0, _classCallCheck3.default)(this, MatchObservable);

        this._emitter = new _events.EventEmitter();
    }

    (0, _createClass3.default)(MatchObservable, [{
        key: 'changeScores',
        value: function changeScores(entity) {
            this.emitter.emit(MatchObservable.events.changeScores, entity);
        }
    }, {
        key: 'changeWinner',
        value: function changeWinner(entity) {
            this.emitter.emit(MatchObservable.events.changeWinner, entity);
        }
    }, {
        key: 'subscribeScores',
        value: function subscribeScores(fn) {
            this.emitter.on(MatchObservable.events.changeScores, fn);
        }
    }, {
        key: 'unSubscribeScores',
        value: function unSubscribeScores(fn) {
            this.emitter.removeListener(MatchObservable.events.changeScores, fn);
        }
    }, {
        key: 'subscribeWinner',
        value: function subscribeWinner(fn) {
            this.emitter.on(MatchObservable.events.changeWinner, fn);
        }
    }, {
        key: 'unSubscribeWinner',
        value: function unSubscribeWinner(fn) {
            this.emitter.removeListener(MatchObservable.events.changeWinner, fn);
        }
    }, {
        key: 'emitter',
        get: function get() {
            return this._emitter;
        }
    }]);
    return MatchObservable;
}();

MatchObservable.events = {
    changeScores: 'changeScores',
    changeWinner: 'changeWinner'
};
var matchObservable = exports.matchObservable = new MatchObservable();
//# sourceMappingURL=match-observable.js.map