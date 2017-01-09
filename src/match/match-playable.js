
import {UndoOperation, StartOver} from './match-command'
import {Match} from './match-entity';
class PlayableMatch  {

    constructor(container, match, commandStrategy, commandInvoker, historyList) {
        this._container = container;
        this._commandStrategy = commandStrategy;
        this._commandInvoker = commandInvoker;
        this._historyList = historyList;
    }

    dispose() {
        this.commandStrategy.dispose();
    }

    get container() {
        return this._container;

    }

    get match() {
        return this.container.get(Match);
    }

    get commandStrategy() {
        return this._commandStrategy;
    }

    get commandInvoker() {
        return this._commandInvoker;
    }

    get historyList() {
        return this._historyList;
    }

    *otherCommands() {
        if (this.commandInvoker.canUndo) {
            let undo = this.container.get(UndoOperation);
            // yield new UndoOperation(this.commandInvoker);
            yield undo;
        }

        if (this.commandStrategy.matchCommandStrategy.canStartOver) {
            yield new StartOver(()=> {
                this.commandStrategy.matchCommandStrategy.startOver();
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
        return this.commandStrategy.matchCommands();
    }

    matchSetCommands() {
        return this.commandStrategy.matchSetCommands();
    }

    setGameCommands() {
        return this.commandStrategy.setGameCommands();
    }


    // invoke(command) {
    //     console.log(`invoking: ${command.title}`);
    //     this.commandInvoker.invoke(command);
    // }

}

export {PlayableMatch}

