
// import {MatchStrategy} from './match-commandStrategy'


class MatchCommand {
    constructor(strategy) {
        this._commandStrategy = strategy;
    }

    get strategy() {
        return this._commandStrategy;
    }

    execute() {

    }

    undo() {

    }

    get title() {
        return this.constructor.name;
    }

}

class StartWarmup extends MatchCommand {

    constructor(strategy) {
        super(strategy);
    }

    execute() {
        this.strategy.startWarmup();

    }

    undo() {
        this.strategy.undoStartWarmup();

    }

    get title() {
        return 'start warmup'
    }

}

class StartPlay extends MatchCommand {
    constructor(strategy, server) {
        super(strategy);
        this._server = server;
    }

    execute() {
        this.strategy.startPlay(this._server)
    }

    undo() {
        this.strategy.undoStartPlay()
    }

    get server() {
        return this._server;
    }

    get title() {
        return `start play ${this.server}`
    }

}

class WinGame extends MatchCommand {
    constructor(strategy, winnerId) {
        super(strategy);
        // console.log(`winner: ${winnerId}`);
        this._winnerId = winnerId;
    }

    execute() {
        this.strategy.winGame(this.winnerId);
    }

    undo() {
        this.strategy.undoWinGame();
    }

    get winnerId() {
        return this._winnerId;
    }

    get title() {
        return `win game ${this.winnerId}`
    }

}

class WinSetTiebreak extends MatchCommand {
    constructor(strategy, winnerId) {
        super(strategy);
        this._winnerId = winnerId;
    }

    execute() {
        this.strategy.winGame(this.winnerId);
    }

    undo() {
        this.strategy.undoWinGame();
    }

    get winnerId() {
        return this._winnerId;
    }

    get title() {
        return `win set tiebreak ${this.winnerId}`
    }

}

class WinMatchTiebreak extends MatchCommand {
    constructor(strategy, winnerId) {
        super(strategy);
        this._winnerId = winnerId;
    }

    execute() {
        this.strategy.winGame(this.winnerId);
    }

    undo() {
        this.strategy.undoWinGame();
    }

    get winnerId() {
        return this._winnerId;
    }

    get title() {
        return `win match tiebreak ${this.winnerId}`
    }
}

class StartGame extends MatchCommand {
    constructor(strategy, server) {
        super(strategy);
        this._server = server;
    }

    execute() {
        this.strategy.startGame(this._server);
    }

    undo() {
        this.strategy.undoStartGame(this._server);
    }

    get server() {
        return this._server;
    }

    get title() {
        return (this.server) ? `start game ${this.server}` : 'start game';
    }

}

class StartSetTiebreak extends MatchCommand {
    constructor(strategy) {
        super(strategy);
    }

    execute() {
        this.strategy.startSetTiebreak();
    }

    undo() {
        this.strategy.undoStartSetTiebreak();
    }

    get title() {
        return 'start set tiebreak';
    }

}

class StartMatchTiebreak extends MatchCommand {
    constructor(strategy, server) {
        super(strategy);
    }

    execute() {
        this.strategy.startMatchTiebreak();
    }

    undo() {
        this.strategy.undoStartMatchTiebreak();
    }

    get title() {
        return 'start match tiebreak';
    }

}

class StartSet extends MatchCommand {
    constructor(strategy) {
        super(strategy);
    }

    execute() {
        this.strategy.startSet()
    }

    undo() {
        this.strategy.undoStartSet()
    }

    get title() {
        // TODO: Set ordinal
        return `start set`
    }

}

// Other commands
class UndoOperation {
    constructor(fn) {
        this.fn = fn;
    }

    execute() {
        this.fn();
    }

    get title() {
        return 'undo'
    }
}

class StartOver {
    constructor(fn) {
        this.fn = fn;
    }

    execute() {
        this.fn();
    }

    get title() {
        return 'start over'
    }
}

export {StartWarmup, StartPlay,
    StartSet, StartMatchTiebreak,
    StartGame, StartSetTiebreak, WinMatchTiebreak,
    WinGame, WinSetTiebreak, StartOver, UndoOperation}

