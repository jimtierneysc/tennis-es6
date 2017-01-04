'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = exports.Set = exports.Match = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _iterator2 = require('babel-runtime/core-js/symbol/iterator');

var _iterator3 = _interopRequireDefault(_iterator2);

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

/**
 * Classes to record tennis match score
 */

// TODO: Parent vs. Owner
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
    key: _iterator3.default,
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
    key: 'count',
    get: function get() {
      return this._childList.length;
    }
  }, {
    key: 'last',
    get: function get() {
      var len = this._childList.length;
      return len > 0 ? this._childList[len - 1] : null;
    }
  }]);
  return ScoreComponentList;
}(ScoreComponent);

var Game = function (_ScoreComponent2) {
  (0, _inherits3.default)(Game, _ScoreComponent2);

  function Game() {
    (0, _classCallCheck3.default)(this, Game);
    return (0, _possibleConstructorReturn3.default)(this, (Game.__proto__ || (0, _getPrototypeOf2.default)(Game)).apply(this, arguments));
  }

  return Game;
}(ScoreComponent);

var Games = function (_ScoreComponentList) {
  (0, _inherits3.default)(Games, _ScoreComponentList);

  function Games() {
    (0, _classCallCheck3.default)(this, Games);
    return (0, _possibleConstructorReturn3.default)(this, (Games.__proto__ || (0, _getPrototypeOf2.default)(Games)).apply(this, arguments));
  }

  (0, _createClass3.default)(Games, [{
    key: 'factory',
    value: function factory(value) {
      return new Game(this, value);
    }
  }]);
  return Games;
}(ScoreComponentList);

var Set = function (_ScoreComponent3) {
  (0, _inherits3.default)(Set, _ScoreComponent3);

  function Set(owner, value) {
    (0, _classCallCheck3.default)(this, Set);

    var _this5 = (0, _possibleConstructorReturn3.default)(this, (Set.__proto__ || (0, _getPrototypeOf2.default)(Set)).call(this, owner, value));

    _this5._games = new Games(_this5, _this5.initArray('games'));
    return _this5;
  }

  (0, _createClass3.default)(Set, [{
    key: 'games',
    get: function get() {
      return this._games;
    }
  }]);
  return Set;
}(ScoreComponent);

var Sets = function (_ScoreComponentList2) {
  (0, _inherits3.default)(Sets, _ScoreComponentList2);

  function Sets() {
    (0, _classCallCheck3.default)(this, Sets);
    return (0, _possibleConstructorReturn3.default)(this, (Sets.__proto__ || (0, _getPrototypeOf2.default)(Sets)).apply(this, arguments));
  }

  (0, _createClass3.default)(Sets, [{
    key: 'factory',
    value: function factory(value) {
      return new Set(this, value);
    }
  }]);
  return Sets;
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

var PlayersList = function (_ScoreComponentList3) {
  (0, _inherits3.default)(PlayersList, _ScoreComponentList3);

  function PlayersList() {
    (0, _classCallCheck3.default)(this, PlayersList);
    return (0, _possibleConstructorReturn3.default)(this, (PlayersList.__proto__ || (0, _getPrototypeOf2.default)(PlayersList)).apply(this, arguments));
  }

  (0, _createClass3.default)(PlayersList, [{
    key: 'factory',
    value: function factory(value) {
      return new Player(this, value);
    }
  }]);
  return PlayersList;
}(ScoreComponentList);

var Players = function (_ScoreComponent5) {
  (0, _inherits3.default)(Players, _ScoreComponent5);

  function Players(owner, value) {
    (0, _classCallCheck3.default)(this, Players);

    var _this9 = (0, _possibleConstructorReturn3.default)(this, (Players.__proto__ || (0, _getPrototypeOf2.default)(Players)).call(this, owner, value || { lastId: 0 }));

    _this9._list = new PlayersList(_this9, _this9.initArray('list'));
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
    key: 'playerId',
    get: function get() {
      return this.value.playerId;
    },
    set: function set(value) {
      this.value.playerId = value;
    }
  }]);
  return PlayerRef;
}(ScoreComponent);

var PlayerRefs = function (_ScoreComponentList4) {
  (0, _inherits3.default)(PlayerRefs, _ScoreComponentList4);

  function PlayerRefs() {
    (0, _classCallCheck3.default)(this, PlayerRefs);
    return (0, _possibleConstructorReturn3.default)(this, (PlayerRefs.__proto__ || (0, _getPrototypeOf2.default)(PlayerRefs)).apply(this, arguments));
  }

  (0, _createClass3.default)(PlayerRefs, [{
    key: 'factory',
    value: function factory(value) {
      return new PlayerRef(this, value);
    }
  }]);
  return PlayerRefs;
}(ScoreComponentList);

var Server = function (_PlayerRef) {
  (0, _inherits3.default)(Server, _PlayerRef);

  function Server() {
    (0, _classCallCheck3.default)(this, Server);
    return (0, _possibleConstructorReturn3.default)(this, (Server.__proto__ || (0, _getPrototypeOf2.default)(Server)).apply(this, arguments));
  }

  return Server;
}(PlayerRef);

var Servers = function (_PlayerRefs) {
  (0, _inherits3.default)(Servers, _PlayerRefs);

  function Servers() {
    (0, _classCallCheck3.default)(this, Servers);
    return (0, _possibleConstructorReturn3.default)(this, (Servers.__proto__ || (0, _getPrototypeOf2.default)(Servers)).apply(this, arguments));
  }

  (0, _createClass3.default)(Servers, [{
    key: 'factory',
    value: function factory(value) {
      return new Server(this, value);
    }
  }]);
  return Servers;
}(PlayerRefs);

var Opponent = function (_PlayerRefs2) {
  (0, _inherits3.default)(Opponent, _PlayerRefs2);

  function Opponent() {
    (0, _classCallCheck3.default)(this, Opponent);
    return (0, _possibleConstructorReturn3.default)(this, (Opponent.__proto__ || (0, _getPrototypeOf2.default)(Opponent)).apply(this, arguments));
  }

  return Opponent;
}(PlayerRefs);

var Opponents = function (_ScoreComponent7) {
  (0, _inherits3.default)(Opponents, _ScoreComponent7);

  function Opponents(owner, value) {
    (0, _classCallCheck3.default)(this, Opponents);

    var _this15 = (0, _possibleConstructorReturn3.default)(this, (Opponents.__proto__ || (0, _getPrototypeOf2.default)(Opponents)).call(this, owner, value || {}));

    _this15._first = new Opponent(_this15, _this15.initArray('first'));
    _this15._second = new Opponent(_this15, _this15.initArray('second'));
    return _this15;
  }

  (0, _createClass3.default)(Opponents, [{
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

var Match = function (_ScoreComponent8) {
  (0, _inherits3.default)(Match, _ScoreComponent8);

  function Match(value) {
    (0, _classCallCheck3.default)(this, Match);

    var _this16 = (0, _possibleConstructorReturn3.default)(this, (Match.__proto__ || (0, _getPrototypeOf2.default)(Match)).call(this, undefined, value));

    _this16._sets = new Sets(_this16, _this16.initArray('sets'));
    _this16._players = new Players(_this16, _this16.initArray('players'));
    _this16._servers = new Servers(_this16, _this16.initArray('servers'));
    _this16._opponents = new Opponents(_this16, _this16.initArray('opponents'));
    _this16._warmingUp = false;
    return _this16;
  }

  (0, _createClass3.default)(Match, [{
    key: 'start',
    value: function start() {
      if (!this.started) {
        this.warmingUp = false;
        new Set(this.sets, {});
      }
    }
  }, {
    key: 'kind',
    set: function set(value) {
      this.value.kind = value;
    },
    get: function get() {
      return this.value.kind || Match.Kinds.SINGLES;
    }
  }, {
    key: 'started',
    get: function get() {
      return this.sets.count > 0;
    }
  }, {
    key: 'warmingUp',
    get: function get() {
      return _warmingUp;
    },
    set: function set(value) {
      _warmingUp = value;
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
  }]);
  return Match;
}(ScoreComponent);

Match.Kinds = {
  SINGLES: 'SINGLES',
  DOUBLES: 'DOUBLES'
};
exports.Match = Match;
exports.Set = Set;
exports.Game = Game;
//# sourceMappingURL=match.js.map