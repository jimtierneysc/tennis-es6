'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MatchStrategy = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _matchCommand = require('./match-command');

var _matchObservable = require('./match-observable');

var _matchCharacteristics = require('./match-characteristics');

var _matchEntity = require('./match-entity');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: Class names are confusing.  Rename.
var MatchStrategy = function () {
    function MatchStrategy(characteristics) {
        (0, _classCallCheck3.default)(this, MatchStrategy);

        this._characteristics = characteristics || {};
        this.characteristics.kind = this.characteristics.kind || _matchCharacteristics.MatchCharacteristics.Kinds.SINGLES;
        this.characteristics.scoring = this.characteristics.scoring || _matchCharacteristics.MatchCharacteristics.Scoring.TWOSETS;
    }

    (0, _createClass3.default)(MatchStrategy, [{
        key: 'createMatch',


        // TODO: Move to a strategy
        value: function createMatch() {
            var match = new _matchEntity.Match();
            this.addPlayers(match);
            return match;
        }
    }, {
        key: 'addPlayers',
        value: function addPlayers(match) {
            var playerCount = 0;
            if (this.doubles) {
                playerCount = 4;
            }

            if (this.singles) {
                playerCount = 2;
            }

            var opponent = match.opponents.first;
            for (var i = 1; i <= playerCount; i++) {
                var player = match.players.list.add();
                opponent.players.add().id = player.id;
                if (i === playerCount / 2) {
                    opponent = match.opponents.second;
                }
            }
        }
    }, {
        key: 'createCommandStrategy',
        value: function createCommandStrategy(match) {
            return new CommandStrategy(match, this);
        }
    }, {
        key: 'characteristics',
        get: function get() {
            return this._characteristics;
        }
    }, {
        key: 'singles',
        get: function get() {
            return this.characteristics.kind === _matchCharacteristics.MatchCharacteristics.Kinds.SINGLES;
        }
    }, {
        key: 'doubles',
        get: function get() {
            return this.characteristics.kind === _matchCharacteristics.MatchCharacteristics.Kinds.DOUBLES;
        }
    }]);
    return MatchStrategy;
}();

var CommandStrategy = function () {
    function CommandStrategy(match, matchStrategy) {
        (0, _classCallCheck3.default)(this, CommandStrategy);

        this._match = match;
        this._matchStrategy = matchStrategy;
        this._matchCommandStrategy = undefined;
        this._matchCommandStrategy = undefined;
        this._matchCommandStrategy = undefined;
        this._servingStrategy = undefined;
    }

    (0, _createClass3.default)(CommandStrategy, [{
        key: 'dispose',
        value: function dispose() {
            [this._matchCommandStrategy, this._matchCommandStrategy, this._matchCommandStrategy, this._servingStrategy].forEach(function (value) {
                if (value) {
                    value.dispose();
                }
            });
        }
    }, {
        key: 'matchCommands',
        value: function matchCommands() {
            return this.matchCommandStrategy.commands();
        }
    }, {
        key: 'setGameCommands',
        value: function setGameCommands() {
            return this.setGameCommandStrategy.commands();
        }
    }, {
        key: 'matchSetCommands',
        value: function matchSetCommands() {
            return this.matchSetCommandStrategy.commands();
        }
    }, {
        key: 'characteristics',
        get: function get() {
            return this.matchStrategy.characteristics;
        }
    }, {
        key: 'match',
        get: function get() {
            return this._match;
        }
    }, {
        key: 'singles',
        get: function get() {
            return this.matchStrategy.singles;
        }
    }, {
        key: 'doubles',
        get: function get() {
            return this.matchStrategy.doubles;
        }
    }, {
        key: 'matchStrategy',
        get: function get() {
            return this._matchStrategy;
        }
    }, {
        key: 'activeSet',
        get: function get() {
            var lastSet = this.match.sets.last;
            if (lastSet && lastSet.inProgress) {
                return lastSet;
            }
        }
    }, {
        key: 'activeGame',
        get: function get() {
            var activeSet = this.activeSet;
            if (activeSet) {
                var lastGame = activeSet.games.last;
                if (lastGame && lastGame.inProgress) {
                    return lastGame;
                }
            }
        }
    }, {
        key: 'servingStrategy',
        get: function get() {
            if (!this._servingStrategy) {
                this._servingStrategy = new ServingStrategy(this.characteristics, this.match.opponents, this.match.servers);
            }
            return this._servingStrategy;
        }
    }, {
        key: 'matchCommandStrategy',
        get: function get() {
            if (!this._matchCommandStrategy) {
                this._matchCommandStrategy = new MatchCommandStrategy(this);
            }
            return this._matchCommandStrategy;
        }
    }, {
        key: 'setGameCommandStrategy',
        get: function get() {
            if (!this._setGameCommandStrategy || this._setGameCommandStrategy.game != this.activeGame) {
                if (this._setGameCommandStrategy) this._setGameCommandStrategy.dispose();
                this._setGameCommandStrategy = new GameCommandStrategy(this.activeGame, this.match.opponents, this.matchSetCommandStrategy);
            }
            return this._setGameCommandStrategy;
        }
    }, {
        key: 'matchSetCommandStrategy',
        get: function get() {
            if (!this._matchSetCommandStrategy || this._matchSetCommandStrategy.matchSet != this.activeSet) {
                if (this._matchSetCommandStrategy) this._matchSetCommandStrategy.dispose();
                this._matchSetCommandStrategy = new SetCommandStrategy(this.activeSet, this.servingStrategy, this.matchCommandStrategy);
            }
            return this._matchSetCommandStrategy;
        }
    }]);
    return CommandStrategy;
}();

var ServingStrategy = function () {
    function ServingStrategy(characteristics, opponents, servers) {
        (0, _classCallCheck3.default)(this, ServingStrategy);

        this._characteristics = characteristics;
        this._opponents = opponents;
        this._opponentPlayerCount = [].concat((0, _toConsumableArray3.default)(this.opponents.first.players)).length + [].concat((0, _toConsumableArray3.default)(this.opponents.second.players)).length;
        this._servers = servers;
    }

    (0, _createClass3.default)(ServingStrategy, [{
        key: 'dispose',
        value: function dispose() {}
    }, {
        key: 'hasPlayerServed',
        value: function hasPlayerServed(player) {
            return this.servers.players.containsValue({ id: player.id });
        }
    }, {
        key: 'hasOpponentServed',
        value: function hasOpponentServed(opponent) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(opponent.players), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var player = _step.value;

                    if (this.hasPlayerServed(player)) {
                        return true;
                    }
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
        }
    }, {
        key: 'removeLastServer',
        value: function removeLastServer() {
            this.servers.players.removeLast();
        }
    }, {
        key: 'addServer',
        value: function addServer(player) {
            if (!player) {
                if (!this.areServersKnown) {
                    throw new Error('player must be specified');
                }
                this.lastServerId = this.nextServer.id;
            } else if (!this.areServersKnown) {
                if (this.hasPlayerServed(player)) {
                    throw new Error('player serving out of order');
                }
                this.servers.players.add().id = player.id;
                this.lastServerId = player.id;
                this._addOtherServers(player);
            }
        }
    }, {
        key: '_addOtherServers',
        value: function _addOtherServers(player) {
            if (this.areServersKnown) {
                var opponent = this.opponentOfPlayer(player);
                while (this.servers.players.count < this.opponentPlayerCount) {
                    opponent = this.nextOpponent(opponent);
                    //[...opponent.players].filter((player)=>return !this.hasPlayerServed(player)).forEach()
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = (0, _getIterator3.default)(opponent.players), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _player = _step2.value;

                            if (!this.hasPlayerServed(_player)) this.servers.players.add().id = _player.id;
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
            }
        }
    }, {
        key: 'opponentOfPlayer',
        value: function opponentOfPlayer(player) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = (0, _getIterator3.default)(this.opponents), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var opponent = _step3.value;

                    if (opponent.players.containsValue({ id: player.id })) {
                        return opponent;
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
        key: 'nextOpponent',
        value: function nextOpponent(opponent) {
            return opponent === this.opponents.first ? this.opponents.second : this.opponents.first;
        }
    }, {
        key: 'serverChoices',
        value: _regenerator2.default.mark(function serverChoices() {
            var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, opponent;

            return _regenerator2.default.wrap(function serverChoices$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (this.areServersKnown) {
                                _context.next = 27;
                                break;
                            }

                            _iteratorNormalCompletion4 = true;
                            _didIteratorError4 = false;
                            _iteratorError4 = undefined;
                            _context.prev = 4;
                            _iterator4 = (0, _getIterator3.default)(this.opponents);

                        case 6:
                            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                                _context.next = 13;
                                break;
                            }

                            opponent = _step4.value;

                            if (this.hasOpponentServed(opponent)) {
                                _context.next = 10;
                                break;
                            }

                            return _context.delegateYield(opponent.players, 't0', 10);

                        case 10:
                            _iteratorNormalCompletion4 = true;
                            _context.next = 6;
                            break;

                        case 13:
                            _context.next = 19;
                            break;

                        case 15:
                            _context.prev = 15;
                            _context.t1 = _context['catch'](4);
                            _didIteratorError4 = true;
                            _iteratorError4 = _context.t1;

                        case 19:
                            _context.prev = 19;
                            _context.prev = 20;

                            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                _iterator4.return();
                            }

                        case 22:
                            _context.prev = 22;

                            if (!_didIteratorError4) {
                                _context.next = 25;
                                break;
                            }

                            throw _iteratorError4;

                        case 25:
                            return _context.finish(22);

                        case 26:
                            return _context.finish(19);

                        case 27:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, serverChoices, this, [[4, 15, 19, 27], [20,, 22, 26]]);
        })
    }, {
        key: 'characteristics',
        get: function get() {
            return this._characteristics;
        }
    }, {
        key: 'opponents',
        get: function get() {
            return this._opponents;
        }
    }, {
        key: 'servers',
        get: function get() {
            return this._servers;
        }
    }, {
        key: 'opponentPlayerCount',
        get: function get() {
            return this._opponentPlayerCount;
        }
    }, {
        key: 'areServersKnown',
        get: function get() {
            return this.servers.players.count >= this.opponentPlayerCount / 2;
        }

        // get match() {
        //     return this._commandStrategy.match;
        // }

    }, {
        key: 'lastServerId',
        get: function get() {
            return this.servers.value.lastServerId;
        },
        set: function set(id) {
            this.servers.value.lastServerId = id;
        }
    }, {
        key: 'nextServer',
        get: function get() {
            if (!this.areServersKnown) {
                throw new Error('next server not known');
            }
            var next = void 0;
            var players = [].concat((0, _toConsumableArray3.default)(this.servers.players));
            var last = this.lastServerId;
            if (!last) return players[0];
            for (var i = 0; i < players.length; i++) {
                if (players[i].id === last) {
                    next = i + 1;
                    break;
                }
            }
            if (next) return players[next % players.length];
        }
    }]);
    return ServingStrategy;
}();

var MatchCommandStrategy = function () {
    function MatchCommandStrategy(commandStrategy) {
        var _this = this;

        (0, _classCallCheck3.default)(this, MatchCommandStrategy);

        this._commandStrategy = commandStrategy;
        this._onWinner = function (entity) {
            return _this.onWinner(entity);
        };
        _matchObservable.matchObservable.subscribeWinner(this._onWinner);
    }

    (0, _createClass3.default)(MatchCommandStrategy, [{
        key: 'dispose',
        value: function dispose() {
            _matchObservable.matchObservable.unSubscribeWinner(this._onWinner);
        }
    }, {
        key: 'onWinner',
        value: function onWinner(entity) {
            if (this.match.sets.contains(entity)) this.updateScore();
        }
    }, {
        key: 'canStartOver',
        value: function canStartOver() {
            return this.match.warmingUp || this.match.started;
        }
    }, {
        key: 'startOver',
        value: function startOver() {
            this.match.winnerId = undefined;
            this.match.warmingUp = undefined;
            this.match.scores = [0, 0];
            this.match.servers.clear();
            this.match.sets.clear();
            // TODO: Clear command history
        }
    }, {
        key: 'startWarmup',
        value: function startWarmup() {
            this.match.warmingUp = true;
        }
    }, {
        key: 'undoStartWarmup',
        value: function undoStartWarmup() {
            this.match.warmingUp = undefined;
        }
    }, {
        key: 'startPlay',
        value: function startPlay(server) {
            new _matchEntity.MatchSet(this.match.sets, {});
            return this.commandStrategy.matchSetCommandStrategy.startGame(server);
        }
    }, {
        key: 'undoStartPlay',
        value: function undoStartPlay(server) {
            this.match.sets.removeLast();
        }
    }, {
        key: 'startSet',
        value: function startSet() {
            new _matchEntity.MatchSet(this.match.sets);
            return this.commandStrategy.matchSetCommandStrategy.startGame();
        }
    }, {
        key: 'undoStartSet',
        value: function undoStartSet() {
            this.match.sets.removeList();
        }
    }, {
        key: 'startMatchTiebreak',
        value: function startMatchTiebreak() {
            new _matchEntity.MatchSet(this.match.sets);
            // TODO: Match set strategy should be tiebreak specific
            var result = this.commandStrategy.matchSetCommandStrategy.startGame();
            result.matchTiebreak = true;
        }
    }, {
        key: 'undoStartMatchTiebreak',
        value: function undoStartMatchTiebreak() {
            this.match.sets.removeList();
        }
    }, {
        key: 'updateScore',
        value: function updateScore() {
            var scores = [0, 0];

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = (0, _getIterator3.default)(this.match.sets), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var set = _step5.value;

                    if (set.winnerId) {
                        scores[set.winnerId - 1] += 1;
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            this.match.scores = scores;

            this.updateWinner(scores);
        }
    }, {
        key: 'updateWinner',
        value: function updateWinner(scores) {
            var winningScore = void 0;
            var max = Math.max.apply(Math, (0, _toConsumableArray3.default)(scores));
            if (max === this.winThreshold) {
                winningScore = max; // tiebreak
            }
            if (winningScore) {
                this.match.winnerId = scores.indexOf(winningScore) + 1;
            }
        }
    }, {
        key: 'commands',
        value: _regenerator2.default.mark(function commands() {
            var _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, server;

            return _regenerator2.default.wrap(function commands$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!(!this.match.warmingUp && !this.match.started)) {
                                _context2.next = 3;
                                break;
                            }

                            _context2.next = 3;
                            return new _matchCommand.StartWarmup(this);

                        case 3:
                            if (this.match.started) {
                                _context2.next = 30;
                                break;
                            }

                            _iteratorNormalCompletion6 = true;
                            _didIteratorError6 = false;
                            _iteratorError6 = undefined;
                            _context2.prev = 7;
                            _iterator6 = (0, _getIterator3.default)(this.commandStrategy.servingStrategy.serverChoices());

                        case 9:
                            if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                                _context2.next = 16;
                                break;
                            }

                            server = _step6.value;
                            _context2.next = 13;
                            return new _matchCommand.StartPlay(this, server.id);

                        case 13:
                            _iteratorNormalCompletion6 = true;
                            _context2.next = 9;
                            break;

                        case 16:
                            _context2.next = 22;
                            break;

                        case 18:
                            _context2.prev = 18;
                            _context2.t0 = _context2['catch'](7);
                            _didIteratorError6 = true;
                            _iteratorError6 = _context2.t0;

                        case 22:
                            _context2.prev = 22;
                            _context2.prev = 23;

                            if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                _iterator6.return();
                            }

                        case 25:
                            _context2.prev = 25;

                            if (!_didIteratorError6) {
                                _context2.next = 28;
                                break;
                            }

                            throw _iteratorError6;

                        case 28:
                            return _context2.finish(25);

                        case 29:
                            return _context2.finish(22);

                        case 30:
                            if (!this.canStartSet) {
                                _context2.next = 35;
                                break;
                            }

                            _context2.next = 33;
                            return new _matchCommand.StartSet(this);

                        case 33:
                            _context2.next = 38;
                            break;

                        case 35:
                            if (!this.canStartMatchTiebreak) {
                                _context2.next = 38;
                                break;
                            }

                            _context2.next = 38;
                            return new _matchCommand.StartMatchTiebreak(this);

                        case 38:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, commands, this, [[7, 18, 22, 30], [23,, 25, 29]]);
        })
    }, {
        key: 'match',
        get: function get() {
            return this._commandStrategy.match;
        }
    }, {
        key: 'characteristics',
        get: function get() {
            return this._commandStrategy.characteristics;
        }
    }, {
        key: 'commandStrategy',
        get: function get() {
            return this._commandStrategy;
        }
    }, {
        key: 'winThreshold',
        get: function get() {
            return 2;
        }
    }, {
        key: 'canStartSet',
        get: function get() {
            return this.match.inProgress && !this.canStartMatchTiebreak && this.match.sets.last.finished;
        }
    }, {
        key: 'canStartMatchTiebreak',
        get: function get() {
            return this.match.inProgress && this.match.scores && !this.match.sets.last.inProgress && this.match.scores[0] === 1 && this.match.scores[1] === 1;
        }
    }]);
    return MatchCommandStrategy;
}();

var SetCommandStrategy = function () {
    function SetCommandStrategy(matchSet, servingStrategy, matchCommandStrategy) {
        var _this2 = this;

        (0, _classCallCheck3.default)(this, SetCommandStrategy);

        this._matchSet = matchSet;
        this._servingStrategy = servingStrategy;
        this._matchCommandStrategy = matchCommandStrategy;
        this._onWinner = function (entity) {
            return _this2.onWinner(entity);
        };
        if (this._matchSet) _matchObservable.matchObservable.subscribeWinner(this._onWinner);
    }

    (0, _createClass3.default)(SetCommandStrategy, [{
        key: 'dispose',
        value: function dispose() {
            _matchObservable.matchObservable.unSubscribeWinner(this._onWinner);
        }
    }, {
        key: 'onWinner',
        value: function onWinner(entity) {
            if (this.matchSet.games.contains(entity)) this.updateScore(entity);
        }
    }, {
        key: 'startGame',
        value: function startGame(server) {
            var result = new _matchEntity.SetGame(this.matchSet.games);
            this.servingStrategy.addServer(server);
            return result;
        }
    }, {
        key: 'undoStartGame',
        value: function undoStartGame(server) {
            this.matchSet.removeLast();
            this.servingStrategy.removeLastServer();
        }
    }, {
        key: 'startSetTiebreak',
        value: function startSetTiebreak() {
            var result = new _matchEntity.SetGame(this.matchSet.games);
            result.setTiebreak = true;
            return result;
        }
    }, {
        key: 'undoStartSetTiebreak',
        value: function undoStartSetTiebreak() {
            this.matchSet.removeLast();
        }
    }, {
        key: 'updateScore',
        value: function updateScore(game) {
            var scores = [0, 0];

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = (0, _getIterator3.default)(this.matchSet.games), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _game = _step7.value;

                    if (_game.winnerId) {
                        scores[_game.winnerId - 1] += 1;
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            this.matchSet.scores = scores;

            this.updateWinner(game, scores);
        }
    }, {
        key: 'updateWinner',
        value: function updateWinner(game, scores) {
            var winningScore = void 0;
            var max = Math.max.apply(Math, (0, _toConsumableArray3.default)(scores));
            var min = Math.min.apply(Math, (0, _toConsumableArray3.default)(scores));
            if (game.matchTiebreak && max == 1) {
                winningScore = max;
            } else {
                if (max === this.winThreshold + 1 && min === this.winThreshold) {
                    winningScore = max; // tiebreak
                } else if (max >= this.winThreshold && max - min >= 2) {
                    winningScore = max;
                }
            }

            if (winningScore) {
                this.matchSet.winnerId = scores.indexOf(winningScore) + 1;
            }
        }
    }, {
        key: 'commands',
        value: _regenerator2.default.mark(function commands() {
            var _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, player;

            return _regenerator2.default.wrap(function commands$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            if (!this.canStartGame) {
                                _context3.next = 34;
                                break;
                            }

                            if (this.servingStrategy.areServersKnown) {
                                _context3.next = 30;
                                break;
                            }

                            _iteratorNormalCompletion8 = true;
                            _didIteratorError8 = false;
                            _iteratorError8 = undefined;
                            _context3.prev = 5;
                            _iterator8 = (0, _getIterator3.default)(this.servingStrategy.serverChoices());

                        case 7:
                            if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
                                _context3.next = 14;
                                break;
                            }

                            player = _step8.value;
                            _context3.next = 11;
                            return new _matchCommand.StartGame(this, player.id);

                        case 11:
                            _iteratorNormalCompletion8 = true;
                            _context3.next = 7;
                            break;

                        case 14:
                            _context3.next = 20;
                            break;

                        case 16:
                            _context3.prev = 16;
                            _context3.t0 = _context3['catch'](5);
                            _didIteratorError8 = true;
                            _iteratorError8 = _context3.t0;

                        case 20:
                            _context3.prev = 20;
                            _context3.prev = 21;

                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                _iterator8.return();
                            }

                        case 23:
                            _context3.prev = 23;

                            if (!_didIteratorError8) {
                                _context3.next = 26;
                                break;
                            }

                            throw _iteratorError8;

                        case 26:
                            return _context3.finish(23);

                        case 27:
                            return _context3.finish(20);

                        case 28:
                            _context3.next = 32;
                            break;

                        case 30:
                            _context3.next = 32;
                            return new _matchCommand.StartGame(this);

                        case 32:
                            _context3.next = 37;
                            break;

                        case 34:
                            if (!this.canStartSetTiebreak) {
                                _context3.next = 37;
                                break;
                            }

                            _context3.next = 37;
                            return new _matchCommand.StartSetTiebreak(this);

                        case 37:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, commands, this, [[5, 16, 20, 28], [21,, 23, 27]]);
        })
    }, {
        key: 'matchSet',
        get: function get() {
            return this._matchSet;
        }
    }, {
        key: 'matchCommandStrategy',
        get: function get() {
            return this._matchCommandStrategy;
        }
    }, {
        key: 'winThreshold',
        get: function get() {
            return 6;
        }
    }, {
        key: 'servingStrategy',
        get: function get() {
            return this._servingStrategy;
        }
    }, {
        key: 'canStartGame',
        get: function get() {
            return this.matchSet && !this.matchSet.finished && !this.canStartSetTiebreak && this.matchSet.games.last.finished;
        }
    }, {
        key: 'canStartSetTiebreak',
        get: function get() {
            return this.matchSet && this.matchSet.games.last.finished && this.matchSet.scores[0] === 6 && this.matchSet.scores[1] === 6;
        }
    }]);
    return SetCommandStrategy;
}();

var GameCommandStrategy = function () {
    function GameCommandStrategy(game, opponents, matchSetStrategy) {
        (0, _classCallCheck3.default)(this, GameCommandStrategy);

        this._game = game;
        this._opponents = opponents;
        this._matchSetStrategy = matchSetStrategy;
    }

    (0, _createClass3.default)(GameCommandStrategy, [{
        key: 'dispose',
        value: function dispose() {}
    }, {
        key: 'winGame',
        value: function winGame(opponentId) {
            this._game.winnerId = opponentId;
        }
    }, {
        key: 'undoWinGame',
        value: function undoWinGame(opponentId) {
            this._game.winnerId = undefined;
        }
    }, {
        key: 'commands',
        value: _regenerator2.default.mark(function commands() {
            var _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, opponent;

            return _regenerator2.default.wrap(function commands$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            if (!(this.game && !this.game.winner)) {
                                _context4.next = 37;
                                break;
                            }

                            _iteratorNormalCompletion9 = true;
                            _didIteratorError9 = false;
                            _iteratorError9 = undefined;
                            _context4.prev = 4;
                            _iterator9 = (0, _getIterator3.default)(this.opponents);

                        case 6:
                            if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
                                _context4.next = 23;
                                break;
                            }

                            opponent = _step9.value;

                            if (!this.game.setTiebreak) {
                                _context4.next = 13;
                                break;
                            }

                            _context4.next = 11;
                            return new _matchCommand.WinSetTiebreak(this, opponent.id);

                        case 11:
                            _context4.next = 20;
                            break;

                        case 13:
                            if (!this.game.matchTiebreak) {
                                _context4.next = 18;
                                break;
                            }

                            _context4.next = 16;
                            return new _matchCommand.WinMatchTiebreak(this, opponent.id);

                        case 16:
                            _context4.next = 20;
                            break;

                        case 18:
                            _context4.next = 20;
                            return new _matchCommand.WinGame(this, opponent.id);

                        case 20:
                            _iteratorNormalCompletion9 = true;
                            _context4.next = 6;
                            break;

                        case 23:
                            _context4.next = 29;
                            break;

                        case 25:
                            _context4.prev = 25;
                            _context4.t0 = _context4['catch'](4);
                            _didIteratorError9 = true;
                            _iteratorError9 = _context4.t0;

                        case 29:
                            _context4.prev = 29;
                            _context4.prev = 30;

                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                _iterator9.return();
                            }

                        case 32:
                            _context4.prev = 32;

                            if (!_didIteratorError9) {
                                _context4.next = 35;
                                break;
                            }

                            throw _iteratorError9;

                        case 35:
                            return _context4.finish(32);

                        case 36:
                            return _context4.finish(29);

                        case 37:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, commands, this, [[4, 25, 29, 37], [30,, 32, 36]]);
        })
    }, {
        key: 'matchSetStrategy',
        get: function get() {
            return this._matchSetStrategy;
        }
    }, {
        key: 'opponents',
        get: function get() {
            return this._opponents;
        }
    }, {
        key: 'game',
        get: function get() {
            return this._game;
        }
    }]);
    return GameCommandStrategy;
}();

exports.MatchStrategy = MatchStrategy;
//# sourceMappingURL=match-strategy.js.map