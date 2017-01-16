'use strict';
import {Match} from './model'
import {createFromFactory, makeOptional} from './di-util'
import {
    MatchController, BasicMatchController,
    MatchSetController, BasicMatchSetController,
    SetGameController, BasicSetGameController,
    MatchControllerEvents
} from './controller'
import {MatchCommandInvoker} from './command-invoker'
import {MatchOptions} from './options'
import {ServingStrategy, BasicServingStrategy} from './serving'
import {
    Container
} from 'aurelia-dependency-injection'
import 'aurelia-polyfills'

class PlayableServices {

    static inject() {
        return makeOptional([Container, Match])
    }

    constructor(container, match) {
        this.container = container;
        this.match = match;
        this.servingStrategy = undefined;
        this.matchController = undefined;
        this.gameStrategy = undefined;
        this.matchSetController = undefined;
        this.onWinnerStrategy = undefined;
    }

    dispose() {
        if (this.onWinnerStrategy)
            this.onWinnerStrategy.dispose();
    }

    run() {
        // Subscribe to events
        this.onWinnerStrategy = createFromFactory(this.container, MatchControllerEvents);
    }

    register(container) {
        // Command invoker singleton
        container.registerSingleton(MatchCommandInvoker,
            () => createFromFactory(container, MatchCommandInvoker));

        // For consistency, container.get returns a function for all controller
        container.registerHandler(ServingStrategy,
            () => () => {
                this.servingStrategy = this.servingStrategy || createFromFactory(this.container, BasicServingStrategy);
                return this.servingStrategy;
            });
        container.registerHandler(SetGameController,
            () => () => {
                if (this.gameStrategy && this.gameStrategy.game != this.lastGame) {
                    this.gameStrategy = undefined;
                }
                this.gameStrategy = this.gameStrategy || createFromFactory(this.container, BasicSetGameController);
                return this.gameStrategy;
            });
        container.registerHandler(MatchSetController,
            () => () => {
                if (this.matchSetController && this.matchSetController.matchSet != this.lastSet) {
                    this.matchSetController = undefined;
                }
                this.matchSetController = this.matchSetController ||
                    createFromFactory(this.container, BasicMatchSetController, this.matchSetOptions);
                return this.matchSetController;
            });
        container.registerSingleton(MatchController,
            () => () => {
                this.matchController = this.matchController || createFromFactory(this.container, BasicMatchController);
                return this.matchController;
            });

    }

    get matchSetOptions() {
        return {
            winThreshold: (()=>{
                switch(this.match.options.scoring) {
                    case MatchOptions.scoring.eightGameProSet:
                        return 8;
                    default:
                        return 6;
                }
            })()
        }
    }

    get lastGame() {
        const lastSet = this.lastSet;
        if (lastSet) {
            return lastSet.games.last;
        }
    }

    get lastSet() {
        return this.match.sets.last;
    }

}

export {PlayableServices};
