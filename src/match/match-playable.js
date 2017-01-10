
import {UndoOperation, StartOver} from './match-command'
import {Match} from './match-entity';
import {MatchHistoryList} from './match-history';
import {MatchCommandInvoker} from './match-command-invoker'
import {MatchCommandStrategy, GameCommandStrategy, SetCommandStrategy, ServingStrategy} from './match-strategy'
class PlayableMatch  {

    constructor(container) {
        this.container = container;
    }

    dispose() {
        // TODO
        // this.commandStrategy.dispose();
    }

    get match() {
        return this.container.get(Match);
    }

    get commandInvoker() {
        return this.container.get(MatchCommandInvoker);
    }

    get matchCommandStrategy() {
        return this.container.get(MatchCommandStrategy);
    }

    get servingStrategy() {
        return this.container.get(ServingStrategy);
    }

    get historyList() {
        return this.container.get(MatchHistoryList);
    }

    *otherCommands() {
        if (this.commandInvoker.canUndo) {
            yield this.container.get(UndoOperation);
        }

        if (this.matchCommandStrategy.canStartOver) {
            yield new StartOver(()=> {
                this.matchCommandStrategy.startOver();
                this.commandInvoker.clearCommands();
            });
        }
    }

    * allCommands() {
        yield* this.setGameCommands();
        yield* this.matchSetCommands();
        yield* this.matchCommands();
        yield* this.otherCommands();
    }

    matchCommands() {
        return this.container.get(MatchCommandStrategy).commands();
    }

    matchSetCommands() {
        return this.container.get(SetCommandStrategy).commands();
    }

    setGameCommands() {
        return this.container.get(GameCommandStrategy).commands();
    }

}

export {PlayableMatch}

