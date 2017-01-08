
import {UndoOperation, StartOver} from './match-command'
class PlayableMatch  {

    constructor(match, commandStrategy, commandInvoker, historyList) {
        this._match = match;
        this._commandStrategy = commandStrategy;
        this._commandInvoker = commandInvoker;
        this._historyList = historyList;
    }

    dispose() {
        this.commandStrategy.dispose();
    }

    get match() {
        return this._match;
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
            yield new UndoOperation(this.commandInvoker);
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

