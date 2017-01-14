'use strict';
import {MatchHistory} from './history'
import {Optional} from 'aurelia-dependency-injection';
import 'aurelia-polyfills';

const _undoStack = new WeakMap();
const _history = new WeakMap();

class MatchCommandInvoker {

    static inject() {
        return [Optional.of(MatchHistory)];
    }
    constructor(history) {
        _history.set(this, history);
        _undoStack.set(this, []);
    }

    addToHistory(command) {
        if (this.history) {
            this.history.addCommand(command);
        }
    }
    
    invoke(command) {
        command.execute();
        this.addToHistory(command);
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
            this.addToHistory(undoCommand);
        }
    }

    clearCommands() {
        _undoStack.set(this, []);
    }

    get history() {
        return _history.get(this);
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