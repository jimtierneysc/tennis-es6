/**
 * Created by Jim on 1/9/17.
 */

import {MatchCommandStrategy, SetCommandStrategy, GameCommandStrategy, ServingStrategy} from './match-strategy'

class MatchPlayableServices {

    constructor(container, match) {
        this.container = container;
        this.match = match;
        this._servingStrategy = undefined;
        this._matchCommandStrategy = undefined;
        this._setGameCommandStrategy = undefined;
        this._matchSetCommandStrategy = undefined;
    }

    * [Symbol.iterator]() {
        yield {
            key: ServingStrategy,
            get: () => this.servingStrategy
        };

        yield {
            key: GameCommandStrategy,
            get: () => this.setGameCommandStrategy
        };

        yield {
            key: SetCommandStrategy,
            get: () => this.matchSetCommandStrategy
        };

        yield {
            key: MatchCommandStrategy,
            get: () => this.matchCommandStrategy
        }

    }

    dispose() {
        [this._gameCommandStrategy, this._matchCommandStrategy, this._setCommandStrategy, this._servingStrategy].forEach((value) => {
            if (value) {
                value.dispose();
            }
        });
    }


    get servingStrategy() {
        if (!this._servingStrategy) {
            this._servingStrategy = new ServingStrategy(this, undefined, this.match.opponents,
                this.match.servers);
        }
        return this._servingStrategy;
    }

    get matchCommandStrategy() {
        if (!this._matchCommandStrategy) {
            this._matchCommandStrategy = new MatchCommandStrategy(this, this.match, undefined);
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

export {MatchPlayableServices};
