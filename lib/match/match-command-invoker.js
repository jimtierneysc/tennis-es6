"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MatchCommandInvoker = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MatchCommandInvoker = function () {
    function MatchCommandInvoker() {
        (0, _classCallCheck3.default)(this, MatchCommandInvoker);

        this._history = [];
    }

    (0, _createClass3.default)(MatchCommandInvoker, [{
        key: "invoke",
        value: function invoke(command) {
            if (command.undo) this.history.push(command);
            command.execute();
        }
    }, {
        key: "undo",
        value: function undo() {
            if (this.canUndo) {
                var command = this.history.splice(-1);
                command[0].undo();
            }
        }
    }, {
        key: "clearHistory",
        value: function clearHistory() {
            this._history = [];
        }
    }, {
        key: "canUndo",
        get: function get() {
            return this.history.length > 0;
        }
    }, {
        key: "history",
        get: function get() {
            return this._history;
        }
    }]);
    return MatchCommandInvoker;
}();

exports.MatchCommandInvoker = MatchCommandInvoker;
//# sourceMappingURL=match-command-invoker.js.map