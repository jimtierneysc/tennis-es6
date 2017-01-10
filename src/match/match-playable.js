
import {UndoOperation, StartOver} from './match-command'
import {Match} from './match-entity';
import {MatchHistoryList} from './match-history';
import {MatchCommandInvoker} from './match-command-invoker'
import {MatchCommandStrategy, GameCommandStrategy, SetCommandStrategy, ServingStrategy} from './match-strategy'

class PlayableMatch  {

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

    *otherCommands() {
        if (this.commandInvoker.canUndo) {
            yield this.container.get(UndoOperation);
        }

        if (this.matchCommandStrategy.canStartOver) {
            yield this.container.get(StartOver);
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

