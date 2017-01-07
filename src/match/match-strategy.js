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
    createMatch(value) {
        let match = new Match(value);
        if (!value) {
            this.addPlayers(match);
        }
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

class StrategyFactory {
    constructor(match, matchStrategy) {
        this._match = match;
        this._matchStrategy = matchStrategy;
        this._matchCommandStrategy = undefined;
        this._matchCommandStrategy = undefined;
        this._matchCommandStrategy = undefined;
        this._servingStrategy = undefined;
    }

    dispose() {
        [this._matchCommandStrategy, this._matchCommandStrategy, this._matchCommandStrategy, this._servingStrategy].forEach((value) => {
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

    // get singles() {
    //     return this.matchStrategy.singles;
    // }
    //
    // get doubles() {
    //     return this.matchStrategy.doubles;
    // }

    get matchStrategy() {
        return this._matchStrategy;
    }

    // get activeSet() {
    //     return this.matchCommandStrategy.activeSet;
    // }
    //
    // get activeGame() {
    //     return this.matchSetCommandStrategy.activeGame;
    // }

    get servingStrategy() {
        if (!this._servingStrategy) {
            this._servingStrategy = new ServingStrategy(this, this.characteristics, this.match.opponents,
                this.match.servers);
        }
        return this._servingStrategy;
    }

    get matchCommandStrategy() {
        if (!this._matchCommandStrategy) {
            this._matchCommandStrategy = new MatchCommandStrategy(this, this.match, this.characteristics);
        }
        return this._matchCommandStrategy;
    }

    get setGameCommandStrategy() {
        if (!this._setGameCommandStrategy || this._setGameCommandStrategy.game != this.lastGame) {
            if (this._setGameCommandStrategy) this._setGameCommandStrategy.dispose();
            this._setGameCommandStrategy = new GameCommandStrategy(this, this.lastGame, this.match.opponents);
        }
        return this._setGameCommandStrategy;
    }

    get matchSetCommandStrategy() {
        if (!this._matchSetCommandStrategy || this._matchSetCommandStrategy.matchSet != this.lastSet) {
            if (this._matchSetCommandStrategy) this._matchSetCommandStrategy.dispose();
            this._matchSetCommandStrategy = new SetCommandStrategy(this, this.lastSet);
        }
        return this._matchSetCommandStrategy;
    }

    get lastGame() {
        let lastSet = this.lastSet;
        if (lastSet) {
            return lastSet.games.last;
        }
    }

    get activeGame() {
        let lastGame = this.lastGame;
        if (lastGame && lastGame.inProgress) {
            return lastGame;
        }
    }

    get activeSet() {
        let lastSet = this.lastSet;
        if (lastSet && lastSet.inProgress) {
            return lastSet;
        }
    }

    get lastSet() {
        return this.match.sets.last;
    }

}

class CommandStrategy {

    constructor(match, matchStrategy) {
        this._match = match;
        this._matchStrategy = matchStrategy;
        this._strategyFactory = new StrategyFactory(match, matchStrategy);
        // this._matchCommandStrategy = undefined;
        // this._matchCommandStrategy = undefined;
        // this._matchCommandStrategy = undefined;
        // this._servingStrategy = undefined;
    }

    dispose() {
        this.strategyFactory.dispose;
        // [this._matchCommandStrategy, this._matchCommandStrategy, this._matchCommandStrategy, this._servingStrategy].forEach((value)=> {
        //     if (value) {
        //         value.dispose();
        //     }
        // });
    }

    get strategyFactory() {
        return this._strategyFactory;
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

    // get activeSet() {
    //     return this.strategyFactory.matchCommandStrategy.activeSet;
    // }
    //
    // get activeGame() {
    //     return this.strategyFactory.matchSetCommandStrategy.activeGame;
    // }

    // get servingStrategy() {
    //     if (!this._servingStrategy) {
    //         this._servingStrategy = new ServingStrategy(this.characteristics, this.match.opponents,
    //             this.match.servers);
    //     }
    //     return this._servingStrategy;
    // }
    //
    // get matchCommandStrategy() {
    //     if (!this._matchCommandStrategy) {
    //         this._matchCommandStrategy = new MatchCommandStrategy(this);
    //     }
    //     return this._matchCommandStrategy;
    // }
    //
    // get setGameCommandStrategy() {
    //     if (!this._setGameCommandStrategy || this._setGameCommandStrategy.game != this.activeGame) {
    //         if (this._setGameCommandStrategy) this._setGameCommandStrategy.dispose();
    //         this._setGameCommandStrategy = new GameCommandStrategy(this.activeGame, this.match.opponents, this.matchSetCommandStrategy);
    //     }
    //     return this._setGameCommandStrategy;
    // }
    //
    // get matchSetCommandStrategy() {
    //     if (!this._matchSetCommandStrategy || this._matchSetCommandStrategy.matchSet != this.activeSet) {
    //         if (this._matchSetCommandStrategy) this._matchSetCommandStrategy.dispose();
    //         this._matchSetCommandStrategy = new SetCommandStrategy(this.activeSet, this.servingStrategy, this.matchCommandStrategy);
    //     }
    //     return this._matchSetCommandStrategy;
    // }

    get servingStrategy() {
        return this.strategyFactory.servingStrategy;
    }

    get matchCommandStrategy() {
        return this.strategyFactory.matchCommandStrategy;
    }

    get setGameCommandStrategy() {
        return this.strategyFactory.setGameCommandStrategy;
    }

    get matchSetCommandStrategy() {
        return this.strategyFactory.matchSetCommandStrategy;
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

    constructor(strategies, characteristics, opponents, servers) {
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

    constructor(strategies, match, characteristics) {
        this._strategies = strategies;
        this._match = match;
        this._characteristics = characteristics;
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

    get characteristics() {
        return this._characteristics;
    }

    // get commandStrategy() {
    //     return this._commandStrategy;
    // }

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
            yield new StartWarmup(this.strategies);
        }
        if (!this.match.started) {
            for (let server of this.strategies.servingStrategy.serverChoices()) {
                yield new StartPlay(this.strategies, server.id);
            }
        }
        if (this.canStartSet) {
            yield new StartSet(this.strategies);
        } else if (this.canStartMatchTiebreak) {
            yield new StartMatchTiebreak(this.strategies);
        }
    }
}

class SetCommandStrategy {

    constructor(strategies, matchSet) {
        this._strategies = strategies;
        this._matchSet = matchSet;
        // this._servingStrategy = servingStrategy;
        // this._matchCommandStrategy = matchCommandStrategy;
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

    // get matchSet() {
    //     return this._matchSet;
    // }

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

    * commands() {
        if (this.canStartGame) {
            if (!this.strategies.servingStrategy.areServersKnown) {
                for (let player of this.servingStrategy.serverChoices()) {
                    yield new StartGame(this.strategies, player.id);
                }
            } else {
                yield new StartGame(this.strategies);
            }
        } else if (this.canStartSetTiebreak) {
            yield new StartSetTiebreak(this.strategies);
        }
    }
}

class GameCommandStrategy {

    constructor(strategies, game, opponents) {
        this._strategies = strategies;
        this._game = game;
        this._opponents = opponents;
        // this._matchSetStrategy = matchSetStrategy;
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

    * commands() {
        if (this.game && !this.game.winnerId) {
            for (let opponent of this.opponents) {
                if (this.game.setTiebreak)
                    yield new WinSetTiebreak(this.strategies, opponent.id);
                else if (this.game.matchTiebreak)
                    yield new WinMatchTiebreak(this.strategies, opponent.id);
                else
                    yield new WinGame(this.strategies, opponent.id);
            }
        }
    }
}

export {MatchStrategy}