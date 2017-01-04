'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SetGame = exports.MatchSet = exports.Match = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _iterator4 = require('babel-runtime/core-js/symbol/iterator');

var _iterator5 = _interopRequireDefault(_iterator4);

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

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _matchObservable = require('./match-observable');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Parent vs. Owner
/**
 * Classes to record tennis match score
 */
var ScoreComponent = function () {
    function ScoreComponent(owner, value) {
        (0, _classCallCheck3.default)(this, ScoreComponent);

        this._childList = undefined;
        this._owner = owner;
        this._value = value || {};
        if (owner) {
            this._owner.addChild(this);
        }
    }

    (0, _createClass3.default)(ScoreComponent, [{
        key: 'initValue',
        value: function initValue(member, defValue) {
            if (!(member in this.value)) {
                this.value[member] = defValue;
            }
            return this.value[member];
        }
    }, {
        key: 'initArray',
        value: function initArray(member) {
            return this.initValue(member, []);
        }
    }, {
        key: 'initObj',
        value: function initObj(member) {
            return this.initValue(member, {});
        }
    }, {
        key: 'childRemoved',
        value: function childRemoved(component) {// virtual

        }
    }, {
        key: 'childAdded',
        value: function childAdded(component) {}
    }, {
        key: 'removeChild',
        value: function removeChild(component) {
            this.childRemoved(component);
        }

        // TODO: Set owner, remove from previous owner

    }, {
        key: 'addChild',
        value: function addChild(component) {
            this.childAdded(component);
        }
    }, {
        key: 'isEqualValue',
        value: function isEqualValue(value) {
            return _.isEqual(value, this.value);
        }
    }, {
        key: 'owner',
        get: function get() {
            return this._owner;
        }
    }, {
        key: 'value',
        get: function get() {
            return this._value;
        }
    }]);
    return ScoreComponent;
}();

var ScoreComponentList = function (_ScoreComponent) {
    (0, _inherits3.default)(ScoreComponentList, _ScoreComponent);

    function ScoreComponentList(owner, value) {
        (0, _classCallCheck3.default)(this, ScoreComponentList);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ScoreComponentList.__proto__ || (0, _getPrototypeOf2.default)(ScoreComponentList)).call(this, owner, value || []));

        _this._childList = [];
        _this.constructChildren();
        return _this;
    }

    (0, _createClass3.default)(ScoreComponentList, [{
        key: 'constructChildren',
        value: function constructChildren() {
            var _this2 = this;

            this.value.forEach(function (i) {
                return _this2.factory(i);
            });
        }
    }, {
        key: 'removeChild',
        value: function removeChild(component) {
            var i = this._childList.indexOf(component);
            if (i >= 0) {
                this._childList.splice(i, 1);
                this.childRemoved(component);
            }
        }

        // TODO: Set owner, remove from previous owner

    }, {
        key: 'addChild',
        value: function addChild(component) {
            this._childList.push(component);
            this.childAdded(component);
        }
    }, {
        key: 'childRemoved',
        value: function childRemoved(component) {
            var i = this.value.indexOf(component.value);
            if (i >= 0) {
                this.value.splice(i, 1);
            }
        }

        // Override

    }, {
        key: 'childAdded',
        value: function childAdded(component) {
            var i = this.value.indexOf(component.value);
            if (i < 0) {
                this.value.push(component.value);
            }
        }
    }, {
        key: 'removeLast',
        value: function removeLast() {
            var item = this.last;
            if (item) {
                this.removeChild(item);
            }
        }
    }, {
        key: _iterator5.default,
        value: _regenerator2.default.mark(function value() {
            var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, arg;

            return _regenerator2.default.wrap(function value$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _iteratorNormalCompletion = true;
                            _didIteratorError = false;
                            _iteratorError = undefined;
                            _context.prev = 3;
                            _iterator = (0, _getIterator3.default)(this._childList);

                        case 5:
                            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                _context.next = 12;
                                break;
                            }

                            arg = _step.value;
                            _context.next = 9;
                            return arg;

                        case 9:
                            _iteratorNormalCompletion = true;
                            _context.next = 5;
                            break;

                        case 12:
                            _context.next = 18;
                            break;

                        case 14:
                            _context.prev = 14;
                            _context.t0 = _context['catch'](3);
                            _didIteratorError = true;
                            _iteratorError = _context.t0;

                        case 18:
                            _context.prev = 18;
                            _context.prev = 19;

                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }

                        case 21:
                            _context.prev = 21;

                            if (!_didIteratorError) {
                                _context.next = 24;
                                break;
                            }

                            throw _iteratorError;

                        case 24:
                            return _context.finish(21);

                        case 25:
                            return _context.finish(18);

                        case 26:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, value, this, [[3, 14, 18, 26], [19,, 21, 25]]);
        })
    }, {
        key: 'add',
        value: function add() {
            var result = this.factory();
            return result;
        }
    }, {
        key: 'factory',
        value: function factory(value) {
            // TODO: Raise exception
            return null;
        }
    }, {
        key: 'containsValue',
        value: function containsValue(value) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(this), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var i = _step2.value;

                    if (i.isEqualValue(value)) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: 'contains',
        value: function contains(entity) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(this), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var i = _step3.value;

                    if (i === entity) {
                        return true;
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    }, {
        key: 'clear',
        value: function clear() {
            while (this.count) {
                this.removeLast();
            }
        }
    }, {
        key: 'count',
        get: function get() {
            return this._childList.length;
        }
    }, {
        key: 'last',
        get: function get() {
            var len = this._childList.length;
            if (len > 0) return this._childList[len - 1];
        }
    }]);
    return ScoreComponentList;
}(ScoreComponent);

var SetGame = function (_ScoreComponent2) {
    (0, _inherits3.default)(SetGame, _ScoreComponent2);

    function SetGame(owner, value) {
        (0, _classCallCheck3.default)(this, SetGame);
        return (0, _possibleConstructorReturn3.default)(this, (SetGame.__proto__ || (0, _getPrototypeOf2.default)(SetGame)).call(this, owner, value));
    }

    // get matchSet() {
    //     return this.owner.owner;
    // }

    (0, _createClass3.default)(SetGame, [{
        key: 'winnerId',
        get: function get() {
            return this.value.winner;
        },
        set: function set(opponentId) {
            // console.log(`set winner: ${opponentId}`);
            this.value.winner = opponentId;
            _matchObservable.matchObservable.changeWinner(this);
        }
    }, {
        key: 'finished',
        get: function get() {
            return this.winnerId;
        }
    }, {
        key: 'inProgress',
        get: function get() {
            return !this.finished;
        }
    }, {
        key: 'matchTiebreak',
        get: function get() {
            return this.value.matchTiebreak;
        },
        set: function set(value) {
            this.value.matchTiebreak = value;
        }
    }, {
        key: 'setTiebreak',
        get: function get() {
            return this.value.setTiebreak;
        },
        set: function set(value) {
            this.value.setTiebreak = value;
        }
    }]);
    return SetGame;
}(ScoreComponent);

var SetGames = function (_ScoreComponentList) {
    (0, _inherits3.default)(SetGames, _ScoreComponentList);

    function SetGames() {
        (0, _classCallCheck3.default)(this, SetGames);
        return (0, _possibleConstructorReturn3.default)(this, (SetGames.__proto__ || (0, _getPrototypeOf2.default)(SetGames)).apply(this, arguments));
    }

    (0, _createClass3.default)(SetGames, [{
        key: 'factory',
        value: function factory(value) {
            return new SetGame(this, value);
        }
    }]);
    return SetGames;
}(ScoreComponentList);

var MatchSet = function (_ScoreComponent3) {
    (0, _inherits3.default)(MatchSet, _ScoreComponent3);

    function MatchSet(owner, value) {
        (0, _classCallCheck3.default)(this, MatchSet);

        var _this5 = (0, _possibleConstructorReturn3.default)(this, (MatchSet.__proto__ || (0, _getPrototypeOf2.default)(MatchSet)).call(this, owner, value));

        _this5._games = new SetGames(_this5, _this5.initArray('games'));
        // TODO: Initialize winner and scores
        _this5.initValue('scores', [0, 0]);
        _this5.initValue('winner', undefined);
        return _this5;
    }

    // get match() {
    //     // TODO: Parent vs. owner
    //     return this.owner.owner;
    // }

    (0, _createClass3.default)(MatchSet, [{
        key: 'games',
        get: function get() {
            return this._games;
        }
    }, {
        key: 'winnerId',
        get: function get() {
            return this.value.winner;
        },
        set: function set(opponentId) {
            this.value.winner = opponentId;
            _matchObservable.matchObservable.changeWinner(this);
        }
    }, {
        key: 'scores',
        get: function get() {
            return this.value.scores;
        },
        set: function set(value) {
            this.value.scores = value;
            _matchObservable.matchObservable.changeScores(this);
        }
    }, {
        key: 'finished',
        get: function get() {
            return this.winnerId;
        }
    }, {
        key: 'inProgress',
        get: function get() {
            return !this.finished;
        }
    }]);
    return MatchSet;
}(ScoreComponent);

var MatchSets = function (_ScoreComponentList2) {
    (0, _inherits3.default)(MatchSets, _ScoreComponentList2);

    function MatchSets() {
        (0, _classCallCheck3.default)(this, MatchSets);
        return (0, _possibleConstructorReturn3.default)(this, (MatchSets.__proto__ || (0, _getPrototypeOf2.default)(MatchSets)).apply(this, arguments));
    }

    (0, _createClass3.default)(MatchSets, [{
        key: 'factory',
        value: function factory(value) {
            return new MatchSet(this, value);
        }
    }]);
    return MatchSets;
}(ScoreComponentList);

var Player = function (_ScoreComponent4) {
    (0, _inherits3.default)(Player, _ScoreComponent4);

    function Player(owner, value) {
        (0, _classCallCheck3.default)(this, Player);
        return (0, _possibleConstructorReturn3.default)(this, (Player.__proto__ || (0, _getPrototypeOf2.default)(Player)).call(this, owner, value || { id: owner.owner._nextId() }));
    }

    (0, _createClass3.default)(Player, [{
        key: 'name',
        get: function get() {
            return this.value.name || "";
        },
        set: function set(value) {
            this.value.name = value;
        }
    }, {
        key: 'id',
        get: function get() {
            return this.value.id;
        }
    }]);
    return Player;
}(ScoreComponent);

var PlayerList = function (_ScoreComponentList3) {
    (0, _inherits3.default)(PlayerList, _ScoreComponentList3);

    function PlayerList() {
        (0, _classCallCheck3.default)(this, PlayerList);
        return (0, _possibleConstructorReturn3.default)(this, (PlayerList.__proto__ || (0, _getPrototypeOf2.default)(PlayerList)).apply(this, arguments));
    }

    (0, _createClass3.default)(PlayerList, [{
        key: 'factory',
        value: function factory(value) {
            return new Player(this, value);
        }
    }]);
    return PlayerList;
}(ScoreComponentList);

var Players = function (_ScoreComponent5) {
    (0, _inherits3.default)(Players, _ScoreComponent5);

    function Players(owner, value) {
        (0, _classCallCheck3.default)(this, Players);

        var _this9 = (0, _possibleConstructorReturn3.default)(this, (Players.__proto__ || (0, _getPrototypeOf2.default)(Players)).call(this, owner, value || { lastId: 0 }));

        _this9._list = new PlayerList(_this9, _this9.initArray('list'));
        return _this9;
    }

    (0, _createClass3.default)(Players, [{
        key: '_nextId',
        value: function _nextId() {
            this.value.lastId = 'lastId' in this.value ? this.value.lastId + 1 : 1;
            return this.value.lastId;
        }
    }, {
        key: 'list',
        get: function get() {
            return this._list;
        }
    }]);
    return Players;
}(ScoreComponent);

var PlayerRef = function (_ScoreComponent6) {
    (0, _inherits3.default)(PlayerRef, _ScoreComponent6);

    function PlayerRef() {
        (0, _classCallCheck3.default)(this, PlayerRef);
        return (0, _possibleConstructorReturn3.default)(this, (PlayerRef.__proto__ || (0, _getPrototypeOf2.default)(PlayerRef)).apply(this, arguments));
    }

    (0, _createClass3.default)(PlayerRef, [{
        key: 'id',
        get: function get() {
            return this.value.id;
        },
        set: function set(value) {
            this.value.id = value;
        }
    }]);
    return PlayerRef;
}(ScoreComponent);

var PlayerRefList = function (_ScoreComponentList4) {
    (0, _inherits3.default)(PlayerRefList, _ScoreComponentList4);

    function PlayerRefList() {
        (0, _classCallCheck3.default)(this, PlayerRefList);
        return (0, _possibleConstructorReturn3.default)(this, (PlayerRefList.__proto__ || (0, _getPrototypeOf2.default)(PlayerRefList)).apply(this, arguments));
    }

    (0, _createClass3.default)(PlayerRefList, [{
        key: 'factory',
        value: function factory(value) {
            return new PlayerRef(this, value);
        }
    }]);
    return PlayerRefList;
}(ScoreComponentList);

var PlayerRefs = function (_ScoreComponent7) {
    (0, _inherits3.default)(PlayerRefs, _ScoreComponent7);

    function PlayerRefs(owner, value, id) {
        (0, _classCallCheck3.default)(this, PlayerRefs);

        var _this12 = (0, _possibleConstructorReturn3.default)(this, (PlayerRefs.__proto__ || (0, _getPrototypeOf2.default)(PlayerRefs)).call(this, owner, value));

        _this12._players = new PlayerRefList(_this12, _this12.initArray('players'));
        return _this12;
    }

    (0, _createClass3.default)(PlayerRefs, [{
        key: 'clear',
        value: function clear() {
            this.players.clear();
        }
    }, {
        key: 'players',
        get: function get() {
            return this._players;
        }
    }]);
    return PlayerRefs;
}(ScoreComponent);

var Servers = function (_PlayerRefs) {
    (0, _inherits3.default)(Servers, _PlayerRefs);

    function Servers() {
        (0, _classCallCheck3.default)(this, Servers);
        return (0, _possibleConstructorReturn3.default)(this, (Servers.__proto__ || (0, _getPrototypeOf2.default)(Servers)).apply(this, arguments));
    }

    return Servers;
}(PlayerRefs);

var Opponent = function (_PlayerRefs2) {
    (0, _inherits3.default)(Opponent, _PlayerRefs2);

    function Opponent(owner, value, id) {
        (0, _classCallCheck3.default)(this, Opponent);

        var _this14 = (0, _possibleConstructorReturn3.default)(this, (Opponent.__proto__ || (0, _getPrototypeOf2.default)(Opponent)).call(this, owner, value));

        _this14.value.id = id;
        return _this14;
    }

    (0, _createClass3.default)(Opponent, [{
        key: 'id',
        get: function get() {
            return this.value.id;
        }
    }]);
    return Opponent;
}(PlayerRefs);

var Opponents = function (_ScoreComponent8) {
    (0, _inherits3.default)(Opponents, _ScoreComponent8);

    function Opponents(owner, value) {
        (0, _classCallCheck3.default)(this, Opponents);

        var _this15 = (0, _possibleConstructorReturn3.default)(this, (Opponents.__proto__ || (0, _getPrototypeOf2.default)(Opponents)).call(this, owner, value || {}));

        _this15._first = new Opponent(_this15, _this15.initObj('first'), 1);
        _this15._second = new Opponent(_this15, _this15.initObj('second'), 2);
        return _this15;
    }

    (0, _createClass3.default)(Opponents, [{
        key: _iterator5.default,
        value: _regenerator2.default.mark(function value() {
            return _regenerator2.default.wrap(function value$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return this._first;

                        case 2:
                            _context2.next = 4;
                            return this._second;

                        case 4:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, value, this);
        })
    }, {
        key: 'first',
        get: function get() {
            return this._first;
        }
    }, {
        key: 'second',
        get: function get() {
            return this._second;
        }
    }]);
    return Opponents;
}(ScoreComponent);

var Match = function (_ScoreComponent9) {
    (0, _inherits3.default)(Match, _ScoreComponent9);

    function Match(value) {
        (0, _classCallCheck3.default)(this, Match);

        var _this16 = (0, _possibleConstructorReturn3.default)(this, (Match.__proto__ || (0, _getPrototypeOf2.default)(Match)).call(this, undefined, value));

        _this16._sets = new MatchSets(_this16, _this16.initArray('sets'));
        _this16._players = new Players(_this16, _this16.initArray('players'));
        _this16._servers = new Servers(_this16, _this16.initArray('servers'));
        _this16._opponents = new Opponents(_this16, _this16.initArray('opponents'));
        _this16.initValue('scores', [0, 0]);
        _this16.initValue('warmingUp', undefined);
        _this16.initValue('winner', undefined);
        return _this16;
    }

    // get singles() {
    //     return this.players.count === 2;
    // }
    //
    // get doubles() {
    //     return this.players.count === 4;
    // }

    (0, _createClass3.default)(Match, [{
        key: 'started',
        get: function get() {
            return this.sets.count > 0;
        }
    }, {
        key: 'finished',
        get: function get() {
            return this.winnerId;
        }
    }, {
        key: 'inProgress',
        get: function get() {
            return this.started && !this.finished;
        }
    }, {
        key: 'warmingUp',
        get: function get() {
            return this.value.warmingUp && !this.started;
        },
        set: function set(value) {
            this.value.warmingUp = value;
        }
    }, {
        key: 'strategy',
        get: function get() {
            return this._commandStrategy;
        }
    }, {
        key: 'sets',
        get: function get() {
            return this._sets;
        }
    }, {
        key: 'players',
        get: function get() {
            return this._players;
        }
    }, {
        key: 'servers',
        get: function get() {
            return this._servers;
        }
    }, {
        key: 'opponents',
        get: function get() {
            return this._opponents;
        }
    }, {
        key: 'winnerId',
        get: function get() {
            return this.value.winner;
        },
        set: function set(winner) {
            this.value.winner = winner;
            _matchObservable.matchObservable.changeWinner(this);
        }
    }, {
        key: 'scores',
        get: function get() {
            return this.value.scores;
        },
        set: function set(value) {
            this.value.scores = value;
            _matchObservable.matchObservable.changeScores(this);
        }
    }]);
    return Match;
}(ScoreComponent);

exports.Match = Match;
exports.MatchSet = MatchSet;
exports.SetGame = SetGame;
//# sourceMappingURL=match-entity.js.map