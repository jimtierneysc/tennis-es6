
import {UndoOperation, StartOver} from './match-command'
class PlayableMatch  {

    constructor(match, commandStrategy, commandInvoker) {
        this._match = match;
        this._commandStrategy = commandStrategy;
        this._commandInvoker = commandInvoker;
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

    *otherCommands() {
        if (this.commandInvoker.canUndo) {
            yield new UndoOperation(()=>this.commandInvoker.undo());
        }

        if (this.commandStrategy.matchCommandStrategy.canStartOver) {
            yield new StartOver(()=> {
                this.commandStrategy.matchCommandStrategy.startOver();
                this.commandInvoker.clearHistory();
            });
        }
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

