
import {Match} from './entity'
import {createFromFactory} from './di-util'
import {PlayerNameService, OpponentNameService} from './name-service'
import {
    MatchCommandStrategy, CommonMatchCommandStrategy,
    SetCommandStrategy, CommonSetCommandStrategy,
    GameCommandStrategy, CommonGameCommandStrategy,
    ServingStrategy, CommonServingStrategy,
    OnWinnerStrategy
} from './strategy'
import {MatchCommandInvoker} from './command-invoker'
import {MatchHistoryList} from './history'
import {
    Container, Factory
} from 'aurelia-dependency-injection'
import 'aurelia-polyfills'

class PlayableMatchServices {

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
        if (this._onWinnerStrategy)
            this._onWinnerStrategy.dispose();
    }

    run() {
        // Subscribe to events
        this._onWinnerStrategy = createFromFactory(this.container, OnWinnerStrategy);
    }

    register(container) {
        // Keep history of execute commands
        container.registerInstance(MatchHistoryList, createFromFactory(container, MatchHistoryList));

        // Command invoker
        container.registerInstance(MatchCommandInvoker, createFromFactory(container, MatchCommandInvoker));

        container.registerHandler(ServingStrategy,
            () => () => this.servingStrategy);
        container.registerHandler(GameCommandStrategy,
            () => () => this.setGameCommandStrategy);
        container.registerHandler(SetCommandStrategy,
            () => () => this.matchSetCommandStrategy);
        container.registerHandler(MatchCommandStrategy,
            () => () => this.matchCommandStrategy);

        // Add default name services
        container.registerInstance(PlayerNameService, createFromFactory(container, PlayerNameService));
        container.registerInstance(OpponentNameService, createFromFactory(container, OpponentNameService));
    }

    get servingStrategy() {
        if (!this._servingStrategy) {
            this._servingStrategy = createFromFactory(this.container, CommonServingStrategy);
        }
        return this._servingStrategy;
    }

    get matchCommandStrategy() {
        if (!this._matchCommandStrategy) {
            this._matchCommandStrategy = createFromFactory(this.container, CommonMatchCommandStrategy);
        }
        return this._matchCommandStrategy;
    }


    get setGameCommandStrategy() {
        if (!this._setGameCommandStrategy || this._setGameCommandStrategy.game != this.lastGame) {
            this._setGameCommandStrategy = createFromFactory(this.container, CommonGameCommandStrategy);
        }
        return this._setGameCommandStrategy;
    }

    get matchSetCommandStrategy() {
        if (!this._matchSetCommandStrategy || this._matchSetCommandStrategy.matchSet != this.lastSet) {
            this._matchSetCommandStrategy = createFromFactory(this.container, CommonSetCommandStrategy);
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

export {PlayableMatchServices};
