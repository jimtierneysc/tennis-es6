import {MatchHistoryList, MatchHistoryCommandItem} from './match-history'
import 'aurelia-polyfills';

const _undoStack = new WeakMap();
const _historyList = new WeakMap();

class MatchCommandInvoker {

    static inject() {
        return [MatchHistoryList];
    }
    constructor(historyList) {
        _historyList.set(this, historyList);
        _undoStack.set(this, []);
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
        _undoStack.set(this, []);
    }

    get historyList() {
        return _historyList.get(this);
    }

    get undoStack() {
        return _undoStack.get(this);
    }

    get undoableCommand() {
        if (this.canUndo) {
            let command = this.undoStack[this.undoStack.length - 1];
            return command;
        }
    }
}

export {MatchCommandInvoker}