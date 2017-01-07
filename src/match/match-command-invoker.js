class MatchCommandInvoker {

    constructor() {
        this._historyQueue = [];
        this._undoStack = [];
    }

    invoke(command) {
        command.execute();
        this.historyQueue.push(command);
        if (command.undo)
            this.undoStack.push(command);
    }

    get canUndo() {
        return this.undoStack.length > 0;
    }

    undo(undoCommand) {
        if (this.canUndo) {
            let command = this.undoStack.splice(-1);
            command[0].undo();
            this.historyQueue.push(undoCommand);
        }
    }

    clearCommands() {
        this._historyQueue = [];
        this._undoStack = [];
    }

    get historyQueue() {
        return this._historyQueue;
    }

    get undoStack() {
        return this._undoStack;
    }

    get undoableCommand() {
        if (this.canUndo) {
            let command = this.undoStack[this.undoStack.length - 1];
            return command;
        }
    }
}

export {MatchCommandInvoker}