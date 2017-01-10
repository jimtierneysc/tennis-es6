/**
 * Created by Jim on 1/9/17.
 */

import {Match} from './match-entity'
import {
    MatchCommandStrategy, CommonMatchCommandStrategy,
    SetCommandStrategy, CommonSetCommandStrategy,
    GameCommandStrategy, CommonGameCommandStrategy,
    ServingStrategy, CommonServingStrategy,
    OnWinnerStrategy
} from './match-strategy'
import {
    Container, Factory
} from 'aurelia-dependency-injection'
import 'aurelia-polyfills'

class MatchPlayableServices {

    static inject() {
        return [Container, Match]
    }
    constructor(container, match) {
        this.container = container;
        this.match = match;
        this._servingStrategy = undefined;
        this._matchCommandStrategy = undefined;
        this._setGameCommandStrategy = undefined;
        this._matchSetCommandStrategy = undefined;
        this._onWinnerStrategy = undefined;
    }

    dispose() {
        this._onWinnerStrategy.dispose();
    }

    register(container) {
        container.registerHandler(ServingStrategy,
            () => () => this.servingStrategy);
        container.registerHandler(GameCommandStrategy,
            () => () => this.setGameCommandStrategy);
        container.registerHandler(SetCommandStrategy,
            () => () => this.matchSetCommandStrategy);
        container.registerHandler(MatchCommandStrategy,
            () => () => this.matchCommandStrategy);

        // The following strategy subscribes to events.  Must always create.
        this._onWinnerStrategy = container.get(OnWinnerStrategy);
    }

    createFromFactory(klass, ...rest) {
        let factory = new Factory(klass);
        let fn = factory.get(this.container);
        let result = fn(...rest);
        return result;
    }

    get servingStrategy() {
        if (!this._servingStrategy) {
            this._servingStrategy = this.createFromFactory(CommonServingStrategy);
        }
        return this._servingStrategy;
    }

    get matchCommandStrategy() {
        if (!this._matchCommandStrategy) {
            this._matchCommandStrategy = this.createFromFactory(CommonMatchCommandStrategy);
        }
        return this._matchCommandStrategy;
    }


    get setGameCommandStrategy() {
        if (!this._setGameCommandStrategy || this._setGameCommandStrategy.game != this.lastGame) {
            this._setGameCommandStrategy = this.createFromFactory(CommonGameCommandStrategy);
        }
        return this._setGameCommandStrategy;
    }

    get matchSetCommandStrategy() {
        if (!this._matchSetCommandStrategy || this._matchSetCommandStrategy.matchSet != this.lastSet) {
            this._matchSetCommandStrategy = this.createFromFactory(CommonSetCommandStrategy);
        }
        return this._matchSetCommandStrategy;
    }

    get lastGame() {
        let lastSet = this.lastSet;
        if (lastSet) {
            return lastSet.games.last;
        }
    }

    get lastSet() {
        return this.match.sets.last;
    }

}

export {MatchPlayableServices};
