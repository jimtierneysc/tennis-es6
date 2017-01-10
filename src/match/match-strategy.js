import {
    StartWarmup, StartPlay, StartSet,
    StartSetTiebreak, WinSetTiebreak,
    StartMatchTiebreak, WinMatchTiebreak,
    StartGame, WinGame, StartOver
} from './match-command';
import {matchObservable} from './match-observable';

import {Match, MatchSet, SetGame} from './match-entity'

import {
//     Lazy,
//     All,
//     Optional,
//     Parent,
    Factory
//     NewInstance,
//     lazy,
//     all,
//     optional,
//     parent,
//     factory,
//     newInstance
} from 'aurelia-dependency-injection';


class ServingStrategy {

    constructor(strategies, options, opponents, servers) {
        this._options = options;
        this._opponents = opponents;
        this._opponentPlayerCount = [...this.opponents.first.players].length + [...this.opponents.second.players].length;
        this._servers = servers;
    }

    dispose() {

    }

    get options() {
        return this._options;
    }

    get opponents() {
        return this._opponents;
    }

    get servers() {
        return this._servers;
    }

    get opponentPlayerCount() {
        return this._opponentPlayerCount;
    }

    get areServersKnown() {
        return this.servers.players.count >= this.opponentPlayerCount / 2;
    }

    get allServers() {
        return this.servers.allServers;

    }

    get lastServerId() {
        return this.servers.value.lastServerId;

    }

    set lastServerId(id) {
        this.servers.value.lastServerId = id;
    }

    hasPlayerServed(player) {
        return this.servers.players.containsValue({id: player.id});
    }

    hasOpponentServed(opponent) {
        for (let player of opponent.players) {
            if (this.hasPlayerServed(player)) {
                return true;
            }
        }
    }

    removeLastServer() {
        this.servers.players.removeLast();
        this._updateAllServers()
    }

    newServer(playerId) {
        if (!playerId) {
            if (!this.areServersKnown) {
                throw new Error('player must be specified');
            }
            this.lastServerId = this.nextServerId;
        }
        else if (!this.areServersKnown) {
            if (this.hasPlayerServed(playerId)) {
                throw new Error('player serving out of order')
            }
            this.servers.players.add().id = playerId;
            this.lastServerId = playerId;
            this._updateAllServers();
        }
    }

    _updateAllServers() {
        if (this.areServersKnown) {
            const playerId = this.servers.players.last.id;
            const allServers = [...this.servers.players].map((value) => value.id);
            let opponent = this.opponentOfPlayer(playerId);
            while (allServers.length < this.opponentPlayerCount) {
                opponent = this.nextOpponent(opponent);
                for (let player of opponent.players) {
                    if (allServers.indexOf(player.id) < 0)
                        allServers.push(player.id);
                }
            }
            this.servers.allServers = allServers;
        } else {
            this.servers.allServers = undefined;
        }
    }

    opponentOfPlayer(playerId) {
        for (let opponent of this.opponents) {
            if (opponent.players.containsValue({id: playerId})) {
                return opponent;
            }
        }
    }

    nextOpponent(opponent) {
        return (opponent === this.opponents.first) ? this.opponents.second : this.opponents.first;
    }

    * serverChoices() {
        if (!this.areServersKnown) {
            for (let opponent of this.opponents) {
                if (!this.hasOpponentServed(opponent)) {
                    yield* opponent.players;
                }
            }
        }
    }

    get nextServerId() {
        if (!this.areServersKnown) {
            throw new Error('next server not known');
        }
        let next;
        let players = this.allServers;
        let last = this.lastServerId;
        if (!last)
            return players[0];
        for (let i = 0; i < players.length; i++) {
            if (players[i] === last) {
                next = i + 1;
                break;
            }
        }
        if (next)
            return players[next % players.length];


    }
}


class MatchCommandStrategy {

    constructor(strategies, match, options) {
        this._strategies = strategies;
        this._match = match;
        this._options = options;
        this._onWinner = (entity) => this.onWinner(entity);
        matchObservable.subscribeWinner(this._onWinner);
    }

    dispose() {
        matchObservable.unSubscribeWinner(this._onWinner);
    }

    onWinner(entity) {
        if (this.match.sets.contains(entity))
            this.updateScore();
    }

    get strategies() {
        return this._strategies;
    }

    get match() {
        return this._match;
    }

    get canStartOver() {
        return (this.match.warmingUp || this.match.started);
    }

    startOver() {
        this.match.winnerId = undefined;
        this.match.warmingUp = undefined;
        this.match.scores = [0, 0];
        this.match.servers.clear();
        this.match.sets.clear();
        // TODO: Clear command history
    }

    startWarmup() {
        this.match.warmingUp = true;
    }

    undoStartWarmup() {
        this.match.warmingUp = undefined;
    }

    startPlay(server) {
        new MatchSet(this.match.sets, {});
        return this.strategies.matchSetCommandStrategy.startGame(server);
    }

    undoStartPlay(server) {
        this.strategies.matchSetCommandStrategy.undoStartGame(server);
        this.match.sets.removeLast();
    }

    startSet() {
        new MatchSet(this.match.sets);
        return this.strategies.matchSetCommandStrategy.startGame();
    }

    undoStartSet() {
        this.match.sets.removeLast();
    }

    startMatchTiebreak() {
        new MatchSet(this.match.sets);
        // TODO: Match set strategy should be tiebreak specific
        let result = this.strategies.matchSetCommandStrategy.startGame();
        result.matchTiebreak = true;
    }

    undoStartMatchTiebreak() {
        this.match.sets.removeLast();
    }

    updateScore() {
        let scores = [0, 0];

        for (let set of this.match.sets) {
            if (set.winnerId) {
                scores[set.winnerId - 1] += 1;
            }
        }

        this.match.scores = scores;

        this.updateWinner(scores);
    }

    get winThreshold() {
        return 2;
    }

    get canStartSet() {
        return this.match.inProgress && !this.canStartMatchTiebreak && this.match.sets.last.finished;
    }

    get canStartMatchTiebreak() {
        return this.match.inProgress && this.match.scores && !this.match.sets.last.inProgress &&
            this.match.scores[0] === 1 && this.match.scores[1] === 1;
    }

    updateWinner(scores) {
        let winningScore;
        let max = Math.max(...scores);
        if (max === this.winThreshold) {
            winningScore = max; // tiebreak
        }
        if (winningScore) {
            this.match.winnerId = scores.indexOf(winningScore) + 1;
        } else {
            this.match.winnerId = undefined;
        }
    }

    * commands() {
        if (!this.match.warmingUp && !this.match.started) {
            yield this.strategies.container.get(StartWarmup);
        }
        if (!this.match.started) {
            for (let server of this.strategies.servingStrategy.serverChoices()) {
                let factory = new Factory(StartPlay);
                let fn = factory.get(this.strategies.container);
                let command = fn(server.id);
                yield command;
            }
        }
        if (this.canStartSet) {
            yield this.strategies.container.get(StartSet);
        } else if (this.canStartMatchTiebreak) {
            yield this.strategies.container.get(StartMatchTiebreak);
        }
    }
}

class SetCommandStrategy {

    constructor(strategies, matchSet) {
        this._strategies = strategies;
        this._matchSet = matchSet;
        this._onWinner = (entity) => this.onWinner(entity);
        if (this._matchSet)
            matchObservable.subscribeWinner(this._onWinner);
    }

    dispose() {
        matchObservable.unSubscribeWinner(this._onWinner);
    }

    get strategies() {
        return this._strategies;
    }

    onWinner(entity) {
        // console.log(`onWinner ${entity.constructor.name}`);
        if (this.matchSet.games.contains(entity))
            this.updateScore(entity);
    }

    startGame(server) {
        const result = new SetGame(this.matchSet.games);
        if (server)
            this.strategies.servingStrategy.newServer(server);
        return result;
    }

    undoStartGame(server) {
        this.matchSet.games.removeLast();
        if (server)
            this.strategies.servingStrategy.removeLastServer();
    }

    startSetTiebreak() {
        const result = new SetGame(this.matchSet.games);
        result.setTiebreak = true;
        return result;
    }

    undoStartSetTiebreak() {
        this.matchSet.games.removeLast();
    }

    undoWinGame() {
        this.matchSet.games.last.winnerId = undefined;
    }

    get winThreshold() {
        return 6;
    }

    updateScore(game) {
        let scores = [0, 0];

        for (let game of this.matchSet.games) {
            if (game.winnerId) {
                scores[game.winnerId - 1] += 1;
            }
        }

        this.matchSet.scores = scores;

        this.updateWinner(game, scores);
    }

    updateWinner(game, scores) {
        let winningScore;
        let max = Math.max(...scores);
        let min = Math.min(...scores);
        if (game.matchTiebreak && max == 1) {
            winningScore = max
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
        else {
            this.matchSet.winnerId = undefined;
        }

    }

    get matchSet() {
        return this._matchSet;
    }

    get canStartGame() {
        return (this.matchSet && !this.matchSet.finished && !this.canStartSetTiebreak &&
        this.matchSet.games.last.finished);
    }

    get canStartSetTiebreak() {
        return (this.matchSet &&
        this.matchSet.games.last.finished && this.matchSet.scores[0] === 6 && this.matchSet.scores[1] === 6);
    }

    createStartGame(id) {
        let factory = new Factory(StartGame);
        let fn = factory.get(this.strategies.container);
        let command = fn(id);
        return command;

    }

    * commands() {
        if (this.canStartGame) {
            if (!this.strategies.servingStrategy.areServersKnown) {
                for (let player of this.strategies.servingStrategy.serverChoices()) {
                    yield createStartGame(player.id);
                }
            } else {
                yield this.createStartGame();
            }
        } else if (this.canStartSetTiebreak) {
            yield this.strategies.container.get(StartSetTiebreak);
        }
    }
}

class GameCommandStrategy {

    constructor(strategies, game, opponents) {
        this._strategies = strategies;
        this._game = game;
        this._opponents = opponents;
    }

    dispose() {

    }

    get strategies() {
        return this._strategies;
    }

    get matchSet() {
        return this.strategies.matchSetCommandStrategy.matchSet;
    }

    winGame(opponentId) {
        this.game.winnerId = opponentId;
    }

    get opponents() {
        return this._opponents;
    }

    get game() {
        return this._game;
    }

    createWinGame(id) {
        let factory = new Factory(WinGame);
        let fn = factory.get(this.strategies.container);
        let command = fn(id);
        return command;
    }

    createWinSetTiebreak(id) {
        let factory = new Factory(WinSetTiebreak);
        let fn = factory.get(this.strategies.container);
        let command = fn(id);
        return command;
    }

    createWinMatchTiebreak(id) {
        let factory = new Factory(WinMatchTiebreak);
        let fn = factory.get(this.strategies.container);
        let command = fn(id);
        return command;
    }

    * commands() {
        if (this.game && !this.game.winnerId) {
            for (let opponent of this.opponents) {
                if (this.game.setTiebreak)
                    yield this.createWinSetTiebreak(opponent.id);
                else if (this.game.matchTiebreak)
                    yield this.createWinMatchTiebreak(opponent.id);
                else {
                    yield this.createWinGame(opponent.id);
                }
            }
        }
    }
}

export {
    MatchCommandStrategy, SetCommandStrategy, GameCommandStrategy,
    ServingStrategy
}