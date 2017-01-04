
class MatchCommandInvoker {

    constructor() {
        this._history = [];
    }

    invoke(command) {
        if (command.undo)
          this.history.push(command);
        command.execute();

    }

    get canUndo() {
        return this.history.length > 0;
    }

    undo() {
        if (this.canUndo) {
            let command = this.history.splice(-1);
            command[0].undo();
        }
    }

    clearHistory() {
        this._history = [];
    }

    get history() {
        return this._history;
    }

}

export {MatchCommandInvoker}