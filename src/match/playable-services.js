'use strict';
import {Match} from './entity'
import {createFromFactory} from './di-util'
import {
    MatchCommandStrategy, CommonMatchCommandStrategy,
    SetCommandStrategy, CommonSetCommandStrategy,
    GameCommandStrategy, CommonGameCommandStrategy,
    ServingStrategy, CommonServingStrategy,
    OnWinnerStrategy
} from './strategy'
import {MatchCommandInvoker} from './command-invoker'
import {
    Container
} from 'aurelia-dependency-injection'
import 'aurelia-polyfills'

class PlayableMatchServices {

    static inject() {
        return [Container, Match]
    }

    constructor(container, match) {
        this.container = container;
        this.match = match;
        this.servingStrategy = undefined;
        this.matchStrategy = undefined;
        this.gameStrategy = undefined;
        this.setStrategy = undefined;
        this.onWinnerStrategy = undefined;
    }

    dispose() {
        if (this.onWinnerStrategy)
            this.onWinnerStrategy.dispose();
    }

    run() {
        // Subscribe to events
        this.onWinnerStrategy = createFromFactory(this.container, OnWinnerStrategy);
    }

    register(container) {
        // Command invoker singleton
        container.registerSingleton(MatchCommandInvoker,
            () => createFromFactory(container, MatchCommandInvoker));

        // For consistency, container.get returns a function for all strategies
        container.registerHandler(ServingStrategy,
            () => () => {
                this.servingStrategy = this.servingStrategy || createFromFactory(this.container, CommonServingStrategy);
                return this.servingStrategy;
            });
        container.registerHandler(GameCommandStrategy,
            () => () => {
                if (this.gameStrategy && this.gameStrategy.game != this.lastGame) {
                    this.gameStrategy = undefined;
                }
                this.gameStrategy = this.gameStrategy || createFromFactory(this.container, CommonGameCommandStrategy);
                return this.gameStrategy;
            });
        container.registerHandler(SetCommandStrategy,
            () => () => {
                if (this.setStrategy && this.setStrategy.matchSet != this.lastSet) {
                    this.setStrategy = undefined;
                }
                this.setStrategy = this.setStrategy || createFromFactory(this.container, CommonSetCommandStrategy);
                return this.setStrategy;
            });
        container.registerSingleton(MatchCommandStrategy,
            () => () => {
                this.matchStrategy = this.matchStrategy || createFromFactory(this.container, CommonMatchCommandStrategy);
                return this.matchStrategy;
            });

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
