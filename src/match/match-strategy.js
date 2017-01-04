import {
    StartWarmup, StartPlay, StartSet,
    StartSetTiebreak, WinSetTiebreak,
    StartMatchTiebreak, WinMatchTiebreak,
    StartGame, WinGame, StartOver
} from './match-command';
import {matchObservable} from './match-observable';

import {MatchCharacteristics} from './match-characteristics'

import {Match, MatchSet, SetGame} from './match-entity'


// TODO: Class names are confusing.  Rename.
class MatchStrategy {

    constructor(characteristics) {
        this._characteristics = characteristics || {};
        this.characteristics.kind = this.characteristics.kind || MatchCharacteristics.Kinds.SINGLES;
        this.characteristics.scoring = this.characteristics.scoring || MatchCharacteristics.Scoring.TWOSETS;
    }

    get characteristics() {
        return this._characteristics;
    }

    // TODO: Move to a strategy
    createMatch() {
        let match = new Match();
        this.addPlayers(match);
        return match;

    }

    get singles() {
        return (this.characteristics.kind === MatchCharacteristics.Kinds.SINGLES);
    }

    get doubles() {
        return (this.characteristics.kind === MatchCharacteristics.Kinds.DOUBLES);
    }

    addPlayers(match) {
        let playerCount = 0;
        if (this.doubles) {
            playerCount = 4;
        }

        if (this.singles) {
            playerCount = 2;
        }

        let opponent = match.opponents.first;
        for (let i = 1; i <= playerCount; i++) {
            let player = match.players.list.add();
            opponent.players.add().id = player.id;
            if (i === playerCount / 2) {
                opponent = match.opponents.second;
            }
        }
    }

    createCommandStrategy(match) {
        return new CommandStrategy(match, this);
    }

}

class CommandStrategy {

    constructor(match, matchStrategy) {
        this._match = match;
        this._matchStrategy = matchStrategy;
        this._matchCommandStrategy = undefined;
        this._matchCommandStrategy = undefined;
        this._matchCommandStrategy = undefined;
        this._servingStrategy = undefined;
    }

    dispose() {
        [this._matchCommandStrategy, this._matchCommandStrategy, this._matchCommandStrategy, this._servingStrategy].forEach((value)=> {
            if (value) {
                value.dispose();
            }
        });
    }

    get characteristics() {
        return this.matchStrategy.characteristics;
    }

    get match() {
        return this._match;
    }

    get singles() {
        return this.matchStrategy.singles;
    }

    get doubles() {
        return this.matchStrategy.doubles;
    }

    get matchStrategy() {
        return this._matchStrategy;
    }

    get activeSet() {
        return this.matchCommandStrategy.activeSet;
    }

    get activeGame() {
        return this.matchSetCommandStrategy.activeGame;
    }

    get servingStrategy() {
        if (!this._servingStrategy) {
            this._servingStrategy = new ServingStrategy(this.characteristics, this.match.opponents,
                this.match.servers);
        }
        return this._servingStrategy;
    }

    get matchCommandStrategy() {
        if (!this._matchCommandStrategy) {
            this._matchCommandStrategy = new MatchCommandStrategy(this);
        }
        return this._matchCommandStrategy;
    }

    get setGameCommandStrategy() {
        if (!this._setGameCommandStrategy || this._setGameCommandStrategy.game != this.activeGame) {
            if (this._setGameCommandStrategy) this._setGameCommandStrategy.dispose();
            this._setGameCommandStrategy = new GameCommandStrategy(this.activeGame, this.match.opponents, this.matchSetCommandStrategy);
        }
        return this._setGameCommandStrategy;
    }

    get matchSetCommandStrategy() {
        if (!this._matchSetCommandStrategy || this._matchSetCommandStrategy.matchSet != this.activeSet) {
            if (this._matchSetCommandStrategy) this._matchSetCommandStrategy.dispose();
            this._matchSetCommandStrategy = new SetCommandStrategy(this.activeSet, this.servingStrategy, this.matchCommandStrategy);
        }
        return this._matchSetCommandStrategy;
    }

    matchCommands() {
        return this.matchCommandStrategy.commands();
    }

    setGameCommands() {
        return this.setGameCommandStrategy.commands();
    }

    matchSetCommands() {
        return this.matchSetCommandStrategy.commands();
    }

    get activeGame() {
        let activeSet = this.activeSet;
        if (activeSet) {
            let lastGame = activeSet.games.last;
            if (lastGame && lastGame.inProgress) {
                return lastGame;
            }
        }
    }

    get activeSet() {
        let lastSet = this.match.sets.last;
        if (lastSet && lastSet.inProgress) {
            return lastSet;
        }
    }
}

class ServingStrategy {

    constructor(characteristics, opponents, servers) {
        this._characteristics = characteristics;
        this._opponents = opponents;
        this._opponentPlayerCount = [...this.opponents.first.players].length + [...this.opponents.second.players].length;
        this._servers = servers;
    }

    dispose() {

    }

    get characteristics() {
        return this._characteristics;
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

    // get match() {
    //     return this._commandStrategy.match;
    // }

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
    }

    addServer(player) {
        if (!player) {
            if (!this.areServersKnown) {
                throw new Error('player must be specified');
            }
            this.lastServerId = this.nextServer.id;
        }
        else if (!this.areServersKnown) {
            if (this.hasPlayerServed(player)) {
                throw new Error('player serving out of order')
            }
            this.servers.players.add().id = player.id;
            this.lastServerId = player.id;
            this._addOtherServers(player);
        }
    }

    _addOtherServers(player) {
        if (this.areServersKnown) {
            let opponent = this.opponentOfPlayer(player);
            while (this.servers.players.count < this.opponentPlayerCount) {
                opponent = this.nextOpponent(opponent);
                //[...opponent.players].filter((player)=>return !this.hasPlayerServed(player)).forEach()
                for (let player of opponent.players) {
                    if (!this.hasPlayerServed(player))
                        this.servers.players.add().id = player.id
                }
            }
        }
    }

    opponentOfPlayer(player) {
        for (let opponent of this.opponents) {
            if (opponent.players.containsValue({id: player.id})) {
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

    get nextServer() {
        if (!this.areServersKnown) {
            throw new Error('next server not known');
        }
        let next;
        let players = [...this.servers.players];
        let last = this.lastServerId;
        if (!last)
            return players[0];
        for (let i = 0; i < players.length; i++) {
            if (players[i].id === last) {
                next = i + 1;
                break;
            }
        }
        if (next)
            return players[next % players.length];


    }
}


class MatchCommandStrategy {

    constructor(commandStrategy) {
        this._commandStrategy = commandStrategy;
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

    get match() {
        return this._commandStrategy.match;
    }

    get characteristics() {
        return this._commandStrategy.characteristics;
    }

    get commandStrategy() {
        return this._commandStrategy;
    }

    canStartOver() {
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
        return this.commandStrategy.matchSetCommandStrategy.startGame(server);
    }

    undoStartPlay(server) {
        this.match.sets.removeLast();
    }

    startSet() {
        new MatchSet(this.match.sets);
        return this.commandStrategy.matchSetCommandStrategy.startGame();
    }

    undoStartSet() {
        this.match.sets.removeList();
    }

    startMatchTiebreak() {
        new MatchSet(this.match.sets);
        // TODO: Match set strategy should be tiebreak specific
        let result = this.commandStrategy.matchSetCommandStrategy.startGame();
        result.matchTiebreak = true;
    }

    undoStartMatchTiebreak() {
        this.match.sets.removeList();
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
        }
    }

    * commands() {
        if (!this.match.warmingUp && !this.match.started) {
            yield new StartWarmup(this);
        }
        if (!this.match.started) {
            for (let server of this.commandStrategy.servingStrategy.serverChoices()) {
                yield new StartPlay(this, server.id);
            }
        }
        if (this.canStartSet) {
            yield new StartSet(this);
        } else if (this.canStartMatchTiebreak) {
            yield new StartMatchTiebreak(this);
        }
     }
}

class SetCommandStrategy {

    constructor(matchSet, servingStrategy, matchCommandStrategy) {
        this._matchSet = matchSet;
        this._servingStrategy = servingStrategy;
        this._matchCommandStrategy = matchCommandStrategy;
        this._onWinner = (entity) => this.onWinner(entity);
        if (this._matchSet)
            matchObservable.subscribeWinner(this._onWinner);
    }

    dispose() {
        matchObservable.unSubscribeWinner(this._onWinner);
    }

    get matchSet() {
        return this._matchSet;
    }

    onWinner(entity) {
        if (this.matchSet.games.contains(entity))
            this.updateScore(entity);
    }

    get matchCommandStrategy() {
        return this._matchCommandStrategy;
    }

    startGame(server) {
        const result = new SetGame(this.matchSet.games);
        this.servingStrategy.addServer(server);
        return result;
    }

    undoStartGame(server) {
        this.matchSet.removeLast();
        this.servingStrategy.removeLastServer();
    }

    startSetTiebreak() {
        const result = new SetGame(this.matchSet.games);
        result.setTiebreak = true;
        return result;
    }

    undoStartSetTiebreak() {
        this.matchSet.removeLast();
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

    }

    get matchSet() {
        return this._matchSet;
    }

    get servingStrategy() {
        return this._servingStrategy;
    }

    get canStartGame() {
        return (this.matchSet && !this.matchSet.finished && !this.canStartSetTiebreak &&
        this.matchSet.games.last.finished);
    }

    get canStartSetTiebreak() {
        return (this.matchSet &&
        this.matchSet.games.last.finished && this.matchSet.scores[0] === 6 && this.matchSet.scores[1] === 6);
    }

    * commands() {
        if (this.canStartGame) {
            if (!this.servingStrategy.areServersKnown) {
                for (let player of this.servingStrategy.serverChoices()) {
                    yield new StartGame(this, player.id);
                }
            } else {
                yield new StartGame(this);
            }
        } else if (this.canStartSetTiebreak) {
            yield new StartSetTiebreak(this);
        }
    }
}

class GameCommandStrategy {

    constructor(game, opponents, matchSetStrategy) {
        this._game = game;
        this._opponents = opponents;
        this._matchSetStrategy = matchSetStrategy;
    }

    dispose() {

    }

    get matchSetStrategy() {
        return this._matchSetStrategy;
    }

    winGame(opponentId) {
        this._game.winnerId = opponentId;
    }

    undoWinGame(opponentId) {
        this._game.winnerId = undefined;
    }

    get opponents() {
        return this._opponents;
    }

    get game() {
        return this._game;
    }

    * commands() {
        if (this.game && !this.game.winner) {
            for (let opponent of this.opponents) {
                if (this.game.setTiebreak)
                    yield new WinSetTiebreak(this, opponent.id);
                else if (this.game.matchTiebreak)
                    yield new WinMatchTiebreak(this, opponent.id);
                else
                    yield new WinGame(this, opponent.id);
            }
        }
    }
}

export {MatchStrategy}