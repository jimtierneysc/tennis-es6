import {MatchHistoryList, MatchHistoryCommand} from './match-history'
import 'aurelia-polyfills';

class MatchCommandInvoker {

    static inject() {
        return [MatchHistoryList];
    }
    constructor(historyList) {
        this._historyList = historyList;
        this._undoStack = [];
    }

    invoke(command) {
        command.execute();
        this.historyList.addCommand(command);
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
            this.historyList.addCommand(undoCommand);
        }
    }

    clearCommands() {
        // this._historyQueue = [];
        this._undoStack = [];
    }

    get historyList() {
        return this._historyList;
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