'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.matchFactory = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _matchStrategy = require('./match-strategy');

var _matchPlayable = require('./match-playable');

var _matchCharacteristics = require('./match-characteristics');

var _matchCommandInvoker = require('./match-command-invoker');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import {Match} from './match-entity'
var MatchFactory = function () {
    function MatchFactory() {
        (0, _classCallCheck3.default)(this, MatchFactory);
    }

    (0, _createClass3.default)(MatchFactory, [{
        key: 'makeMatch',


        // static Kinds = {
        //     SINGLES: 'SINGLES',
        //     DOUBLES: 'DOUBLES',
        // };
        //
        // static Scoring = {
        //     TWOSETS: 'TWOSETS',
        //     THREESETS: 'THREESETS'
        // };

        value: function makeMatch(characteristics) {

            // TODO: Get kinds for elsewhere

            var strategy = new _matchStrategy.MatchStrategy(characteristics);
            var match = strategy.createMatch();
            var commandStrategy = strategy.createCommandStrategy(match);
            var commandInvoker = new _matchCommandInvoker.MatchCommandInvoker();
            return new _matchPlayable.PlayableMatch(match, commandStrategy, commandInvoker);
        }

        // makeMatch(value) {
        //
        //     return makeMatch(value.kind, value.scoring);
        //
        // }

    }]);
    return MatchFactory;
}();

var matchFactory = exports.matchFactory = new MatchFactory();
//# sourceMappingURL=match-factory.js.map