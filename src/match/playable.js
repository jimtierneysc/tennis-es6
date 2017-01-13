'use strict';
import {UndoOperation, StartOver} from './command'
import {Match} from './entity';
import {MatchHistoryList} from './history';
import {MatchCommandInvoker} from './command-invoker'
import {MatchCommandStrategy, GameCommandStrategy, SetCommandStrategy, ServingStrategy} from './strategy'
import {PlayerNameService, OpponentNameService} from './name-service'
import {createFromFactory} from './di-util'

class PlayableMatch {

    constructor(container) {
        this.container = container;
    }

    get match() {
        return this.container.get(Match);
    }

    get commandInvoker() {
        return this.container.get(MatchCommandInvoker);
    }

    get matchCommandStrategy() {
        return this.container.get(MatchCommandStrategy)();
    }

    get setGameCommandStrategy() {
        return this.container.get(GameCommandStrategy)();
    }

    get matchSetCommandStrategy() {
        return this.container.get(SetCommandStrategy)();
    }

    get servingStrategy() {
        return this.container.get(ServingStrategy)();
    }

    get historyList() {
        return this.container.get(MatchHistoryList);
    }

    get playerNameService() {
        return this.container.get(PlayerNameService);
    }

    get opponentNameService() {
        return this.container.get(OpponentNameService);
    }

    *otherCommands() {
        if (this.commandInvoker.canUndo) {
            yield createFromFactory(this.container, UndoOperation);
        }

        if (this.matchCommandStrategy.canStartOver) {
            yield createFromFactory(this.container, StartOver);
        }
    }

    * allCommands() {
        yield* this.setGameCommands();
        yield* this.matchSetCommands();
        yield* this.matchCommands();
        yield* this.otherCommands();
    }

    matchCommands() {
        return this.matchCommandStrategy.commands();
    }

    matchSetCommands() {
        return this.matchSetCommandStrategy.commands();
    }

    setGameCommands() {
        return this.setGameCommandStrategy.commands();
    }

}

export {PlayableMatch}

