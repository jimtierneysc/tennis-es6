'use strict';
import {MatchHistory} from './history'
import {makeOptional} from './di-util';
import 'aurelia-polyfills';

/**
 * Command Invoker
 *
 * Invoke a command or undo a command.  If the MatchHistory service is available,
 * add the command to history.
 */


// containers for read only properties
const _undoStack = new WeakMap();
const _history = new WeakMap();

class MatchCommandInvoker {

    static inject() {
        return makeOptional([MatchHistory]);
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
            const command = this.undoStack.splice(-1);
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
            const command = this.undoStack[this.undoStack.length - 1];
            return command;
        }
    }
}

export {MatchCommandInvoker}