'use strict';
import {
    StartWarmup, StartPlay, StartSet,
    StartSetTiebreak, WinSetTiebreak,
    StartMatchTiebreak, WinMatchTiebreak,
    StartGame, WinGame
} from './command';
import {ServingStrategy} from './serving'

import {Match, MatchSet, SetGame} from './model'
import {MatchOptions} from './options'
import {Container} from 'aurelia-dependency-injection';
import 'aurelia-polyfills';
import {createCommand} from './command-factory'
import {makeOptional} from './di-util'

class MatchController {

}

class BasicMatchController extends MatchController {
    static inject() {
        return makeOptional([Container, Match, MatchSetController, ServingStrategy]);
    }

    constructor(container, match, matchSetController, servingStrategy) {
        super();
        this.matchSetController = matchSetController; // function
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
        return this.matchSetController().startGame(server);
    }

    undoStartPlay(server) {
        this.matchSetController().undoStartGame(server);
        this.match.sets.removeLast();
    }

    startSet() {
        new MatchSet(this.match.sets);
        return this.matchSetController().startGame();
    }

    undoStartSet() {
        this.match.sets.removeLast();
    }

    startMatchTiebreak() {
        new MatchSet(this.match.sets);
        // TODO: Match set strategy should be tiebreak specific
        let result = this.matchSetController().startGame();
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
        return MatchOptions.winMatchThreshold(this.match.options);
    }

    get _canStartSet() {
        return this.match.inProgress && !this._canStartMatchTiebreak && this.match.sets.last.finished;
    }

    get _canStartMatchTiebreak() {
        return MatchOptions.finalSetIsTiebreak(this.match.options) &&
            this.match.inProgress && this.match.scores && !this.match.sets.last.inProgress &&
            this.match.scores[0] === this.match.scores[1] && this.match.scores[0] + 1 === this._winThreshold;
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
            yield createCommand(this.container, StartWarmup);
        }
        if (!this.match.started) {
            for (let server of this.servingStrategy().serverChoices()) {
                yield createCommand(this.container, StartPlay, server.id);
            }
        }
        if (this._canStartSet) {
            yield createCommand(this.container, StartSet);
        } else if (this._canStartMatchTiebreak) {
            yield createCommand(this.container, StartMatchTiebreak);
        }
    }
}

class MatchSetController {

}

class BasicMatchSetController extends MatchSetController {
    static inject() {
        return makeOptional([Container, Match, ServingStrategy]);
    }

    constructor(container, match, servingStrategy, options) {
        super();
        this.match = match;
        this.container = container;
        this.matchSet = match.sets.last;
        this.servingStrategy = servingStrategy;
        this.options = options;
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
            let winThreshold = MatchOptions.winSetThreshold(this.match.options);
            if (max === winThreshold + 1 && min === winThreshold) {
                winningScore = max; // tiebreak
            } else if (max >= winThreshold && max - min >= 2) {
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
        const threshold = MatchOptions.winSetThreshold(this.match.options);
        return (this.matchSet &&
        this.matchSet.games.last.finished && this.matchSet.scores[0] === threshold && this.matchSet.scores[1] === threshold);
    }

    * commands() {
        if (this._canStartGame) {
            if (!this.servingStrategy().knowServingOrder) {
                for (let player of this.servingStrategy().serverChoices()) {
                    yield createCommand(this.container, StartGame, player.id);
                }
            } else {
                yield createCommand(this.container, StartGame);
            }
        } else if (this._canStartSetTiebreak) {
            yield createCommand(this.container, StartSetTiebreak);
        }
    }
}

class SetGameController {

}

class BasicSetGameController extends SetGameController {

    static inject() {
        return makeOptional([Container, Match]);
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
                    yield createCommand(this.container, WinSetTiebreak, opponent.id);
                else if (this.game.matchTiebreak)
                    yield createCommand(this.container, WinMatchTiebreak, opponent.id);
                else {
                    yield createCommand(this.container, WinGame, opponent.id);
                }
            }
        }
    }
}

class MatchControllerEvents {
    static inject() {
        return makeOptional([Match, MatchSetController, MatchController]);
    }

    constructor(match, matchSetController, matchController) {
        this.matchSetController = matchSetController; // function
        this.matchController = matchController; // function
        this.onWinner = (entity) => this._onWinner(entity);
        this.matchObservable = match.observable;
        this.matchObservable.subscribeWinner(this.onWinner);
    }

    dispose() {
        this.matchObservable.unSubscribeWinner(this.onWinner);
    }

    _onWinner(entity) {
        if (entity instanceof SetGame)
            this.matchSetController().onWinGame(entity);
        else if (entity instanceof MatchSet)
            this.matchController().onWinSet(entity);
    }
}

export {
    MatchController, BasicMatchController,
    MatchSetController, BasicMatchSetController,
    SetGameController, BasicSetGameController,
    MatchControllerEvents
}