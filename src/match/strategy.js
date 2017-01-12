import {
    StartWarmup, StartPlay, StartSet,
    StartSetTiebreak, WinSetTiebreak,
    StartMatchTiebreak, WinMatchTiebreak,
    StartGame, WinGame
} from './command';

import {Match, MatchSet, SetGame} from './entity'
import {Container} from 'aurelia-dependency-injection';


import {
    Factory
} from 'aurelia-dependency-injection';
import 'aurelia-polyfills';
import {createFromFactory} from './di-util'

class OnWinnerStrategy {
    static inject() {
        return [Match, SetCommandStrategy, MatchCommandStrategy];
    }

    constructor(match, setStrategy, matchStrategy) {
        this.setStrategy = setStrategy; // function
        this.matchStrategy = matchStrategy;
        this.onWinner = (entity) => this._onWinner(entity);
        this.matchObservable = match.observable;
        this.matchObservable.subscribeWinner(this.onWinner);
    }

    dispose() {
        this.matchObservable.unSubscribeWinner(this.onWinner);
    }

    _onWinner(entity) {
        if (entity instanceof SetGame)
            this.setStrategy().onWinGame(entity);
        else if (entity instanceof MatchSet)
            this.matchStrategy().onWinSet(entity);
    }
}

class ServingStrategy {
}

class CommonServingStrategy extends ServingStrategy {
    static inject() {
        return [Match];
    }

    constructor(match) {
        super();
        this.opponents = match.opponents;
        this.servers = match.servers;
    }

    get knowServingOrder() {
        return this.servers.players.count >= this._opponentPlayerCount / 2;
    }

    get lastServerId() {
        return this.servers.value.lastServerId;

    }

    set _lastServerId(id) {
        this.servers.value.lastServerId = id;
    }

    * serverChoices() {
        if (!this.knowServingOrder) {
            for (let opponent of this.opponents) {
                if (!this._hasOpponentServed(opponent)) {
                    yield* opponent.players;
                }
            }
        }
    }

    removeLastServer() {
        this.servers.players.removeLast();
        this._updateServingOrder()
    }

    newServer(playerId) {
        if (!playerId) {
            if (!this.knowServingOrder) {
                throw new Error('player must be specified');
            }
            this._lastServerId = this._nextServerId;
        }
        else if (!this.knowServingOrder) {
            if (this._hasPlayerServed(playerId)) {
                throw new Error('player serving out of order')
            }
            this.servers.players.add().id = playerId;
            this._lastServerId = playerId;
            this._updateServingOrder();
        }
    }

    get _opponentPlayerCount() {
        return [...this.opponents.first.players].length + [...this.opponents.second.players].length;
    }

    _hasPlayerServed(player) {
        return this.servers.players.containsValue({id: player.id});
    }

    _hasOpponentServed(opponent) {
        for (let player of opponent.players) {
            if (this._hasPlayerServed(player)) {
                return true;
            }
        }
    }

    _updateServingOrder() {
        // Once the half the players have served, the serving is calculated
        if (this.knowServingOrder) {
            const playerId = this.servers.players.last.id;
            const servingOrder = [...this.servers.players].map((value) => value.id);
            let opponent = this._opponentOfPlayer(playerId);
            while (servingOrder.length < this._opponentPlayerCount) {
                opponent = this._nextOpponent(opponent);
                for (let player of opponent.players) {
                    if (servingOrder.indexOf(player.id) < 0)
                        servingOrder.push(player.id);
                }
            }
            this.servers.servingOrder = servingOrder;
        } else {
            this.servers.servingOrder = undefined;
        }
    }

    _opponentOfPlayer(playerId) {
        for (let opponent of this.opponents) {
            if (opponent.players.containsValue({id: playerId})) {
                return opponent;
            }
        }
    }

    _nextOpponent(opponent) {
        return (opponent === this.opponents.first) ? this.opponents.second : this.opponents.first;
    }

    get _nextServerId() {
        if (!this.knowServingOrder) {
            throw new Error('next server not known');
        }
        let next;
        let players = this.servers.servingOrder;
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

}

class CommonMatchCommandStrategy extends MatchCommandStrategy {
    static inject() {
        return [Container, Match, SetCommandStrategy, ServingStrategy];
    }

    constructor(container, match, matchSetCommandStrategy, servingStrategy) {
        super();
        this.matchSetCommandStrategy = matchSetCommandStrategy; // function
        this.match = match;
        this.container = container;
        this.servingStrategy = servingStrategy;
    }

    onWinSet(entity) {
        if (this.match.sets.contains(entity))
            this._updateScore();
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
    }

    startWarmup() {
        this.match.warmingUp = true;
    }

    undoStartWarmup() {
        this.match.warmingUp = undefined;
    }

    startPlay(server) {
        new MatchSet(this.match.sets, {});
        return this.matchSetCommandStrategy().startGame(server);
    }

    undoStartPlay(server) {
        this.matchSetCommandStrategy().undoStartGame(server);
        this.match.sets.removeLast();
    }

    startSet() {
        new MatchSet(this.match.sets);
        return this.matchSetCommandStrategy().startGame();
    }

    undoStartSet() {
        this.match.sets.removeLast();
    }

    startMatchTiebreak() {
        new MatchSet(this.match.sets);
        // TODO: Match set strategy should be tiebreak specific
        let result = this.matchSetCommandStrategy().startGame();
        result.matchTiebreak = true;
    }

    undoStartMatchTiebreak() {
        this.match.sets.removeLast();
    }

    _updateScore() {
        let scores = [0, 0];

        for (let set of this.match.sets) {
            if (set.winnerId) {
                scores[set.winnerId - 1] += 1;
            }
        }

        this.match.scores = scores;

        this._updateWinner(scores);
    }

    get _winThreshold() {
        return 2;
    }

    get _canStartSet() {
        return this.match.inProgress && !this._canStartMatchTiebreak && this.match.sets.last.finished;
    }

    get _canStartMatchTiebreak() {
        return this.match.inProgress && this.match.scores && !this.match.sets.last.inProgress &&
            this.match.scores[0] === 1 && this.match.scores[1] === 1;
    }

    _updateWinner(scores) {
        let winningScore;
        let max = Math.max(...scores);
        if (max === this._winThreshold) {
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
            yield createFromFactory(this.container, StartWarmup);
        }
        if (!this.match.started) {
            for (let server of this.servingStrategy().serverChoices()) {
                yield createFromFactory(this.container, StartPlay, server.id);
             }
        }
        if (this._canStartSet) {
            yield this.container.get(StartSet);
        } else if (this._canStartMatchTiebreak) {
            yield createFromFactory(this.container, StartMatchTiebreak);
        }
    }
}

class SetCommandStrategy {

}

class CommonSetCommandStrategy extends SetCommandStrategy {
    static inject() {
        return [Container, Match, ServingStrategy];
    }

    constructor(container, match, servingStrategy) {
        super();
        this.container = container;
        this.matchSet = match.sets.last;
        this.servingStrategy = servingStrategy;
    }

    onWinGame(entity) {
        // console.log(`onWinner ${entity.constructor.name}`);
        if (this.matchSet && this.matchSet.games.contains(entity))
            this._updateScore(entity);
    }

    startGame(server) {
        const result = new SetGame(this.matchSet.games);
        if (server)
            this.servingStrategy().newServer(server);
        return result;
    }

    undoStartGame(server) {
        this.matchSet.games.removeLast();
        if (server)
            this.servingStrategy().removeLastServer();
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

    get _winThreshold() {
        return 6;
    }

    _updateScore(game) {
        let scores = [0, 0];

        for (let game of this.matchSet.games) {
            if (game.winnerId) {
                scores[game.winnerId - 1] += 1;
            }
        }

        this.matchSet.scores = scores;

        this._updateWinner(game, scores);
    }

    _updateWinner(game, scores) {
        let winningScore;
        let max = Math.max(...scores);
        let min = Math.min(...scores);
        if (game.matchTiebreak && max == 1) {
            winningScore = max
        } else {
            if (max === this._winThreshold + 1 && min === this._winThreshold) {
                winningScore = max; // tiebreak
            } else if (max >= this._winThreshold && max - min >= 2) {
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

    get _canStartGame() {
        return (this.matchSet && !this.matchSet.finished && !this._canStartSetTiebreak &&
        this.matchSet.games.last.finished);
    }

    get _canStartSetTiebreak() {
        return (this.matchSet &&
        this.matchSet.games.last.finished && this.matchSet.scores[0] === 6 && this.matchSet.scores[1] === 6);
    }

    * commands() {
        if (this._canStartGame) {
            if (!this.servingStrategy().knowServingOrder) {
                for (let player of this.servingStrategy().serverChoices()) {
                    yield createFromFactory(this.container, StartGame, player.id);
                }
            } else {
                yield createFromFactory(this.container, StartGame);
            }
        } else if (this._canStartSetTiebreak) {
            yield createFromFactory(this.container, StartSetTiebreak);
        }
    }
}

class GameCommandStrategy {

}

class CommonGameCommandStrategy extends GameCommandStrategy {

    static inject() {
        return [Container, Match];
    }

    constructor(container, match) {
        super();
        this.container = container;
        this.opponents = match.opponents;
        this.game = (() => {
            let lastSet = match.sets.last;
            if (lastSet)
                return lastSet.games.last;
        })();
    }

    winGame(opponentId) {
        this.game.winnerId = opponentId;
    }

    * commands() {
        if (this.game && !this.game.winnerId) {
            for (let opponent of this.opponents) {
                if (this.game.setTiebreak)
                    yield createFromFactory(this.container, WinSetTiebreak, opponent.id);
                else if (this.game.matchTiebreak)
                    yield createFromFactory(this.container, WinMatchTiebreak, opponent.id);
                else {
                    yield createFromFactory(this.container, WinGame, opponent.id);
                }
            }
        }
    }
}

export {
    MatchCommandStrategy, CommonMatchCommandStrategy,
    SetCommandStrategy, CommonSetCommandStrategy,
    GameCommandStrategy, CommonGameCommandStrategy,
    ServingStrategy, CommonServingStrategy,
    OnWinnerStrategy
}