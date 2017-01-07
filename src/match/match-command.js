// import {MatchStrategy} from './match-commandStrategy'


class MatchCommand {
    constructor(strategies, title) {
        this._strategies = strategies;
        this._title = title;
    }

    get strategies() {
        return this._strategies;
    }

    execute() {

    }

    undo() {

    }

    get title() {
        return this._title;
    }

}

class StartWarmup extends MatchCommand {

    constructor(strategies) {
        super(strategies, 'start warmup');
    }

    execute() {
        this.strategies.matchCommandStrategy.startWarmup();

    }

    undo() {
        this.strategies.matchCommandStrategy.undoStartWarmup();

    }

}

class StartPlay extends MatchCommand {
    constructor(strategies, server) {
        super(strategies, `start play ${server}`);
        this._server = server;
    }

    execute() {
        this.strategies.matchCommandStrategy.startPlay(this._server)
    }

    undo() {
        this.strategies.matchCommandStrategy.undoStartPlay(this._server)
    }

    get server() {
        return this._server;
    }
}

class WinGame extends MatchCommand {
    constructor(strategies, winnerId) {
        super(strategies,
            `win game[${strategies.setGameCommandStrategy.game.index}] by ${winnerId}`);
        // console.log(`winner: ${winnerId}`);

        this._winnerId = winnerId;
    }

    execute() {
        this.strategies.setGameCommandStrategy.winGame(this.winnerId);
    }

    undo() {
        this.strategies.matchSetCommandStrategy.undoWinGame();
    }

    get winnerId() {
        return this._winnerId;
    }
}

class WinSetTiebreak extends MatchCommand {
    constructor(strategies, winnerId) {
        super(strategies, `win set[${strategies.matchSetCommandStrategy.matchSet.index}] tiebreak by ${winnerId}`);
        this._winnerId = winnerId;
    }

    execute() {
        this.strategies.setGameCommandStrategy.winGame(this.winnerId);
    }

    undo() {
        this.strategies.matchSetCommandStrategy.undoWinGame();
    }

    get winnerId() {
        return this._winnerId;
    }

}

class WinMatchTiebreak extends MatchCommand {
    constructor(strategies, winnerId) {
        super(strategies, `win match tiebreak ${winnerId}`);
        this._winnerId = winnerId;
    }

    execute() {
        this.strategies.setGameCommandStrategy.winGame(this.winnerId);
    }

    undo() {
        this.strategies.matchSetCommandStrategy.undoWinGame();
    }

    get winnerId() {
        return this._winnerId;
    }
}

class StartGame extends MatchCommand {
    constructor(strategies, server) {
        let title = `start game[${strategies.matchSetCommandStrategy.matchSet.games.count}]`;
        super(strategies, (server) ? `{$title} ${server}` : title);
        this._server = server;
    }

    execute() {
        this.strategies.matchSetCommandStrategy.startGame(this._server);
    }

    undo() {
        this.strategies.matchSetCommandStrategy.undoStartGame(this._server);
    }

    get server() {
        return this._server;
    }

}

class StartSetTiebreak extends MatchCommand {
    constructor(strategies) {
        super(strategies, `start set[${strategies.matchSetCommandStrategy.matchSet.index}] tiebreak`);
    }

    execute() {
        this.strategies.matchSetCommandStrategy.startSetTiebreak();
    }

    undo() {
        this.strategies.matchSetCommandStrategy.undoStartSetTiebreak();
    }

}

class StartMatchTiebreak extends MatchCommand {
    constructor(strategies) {
        super(strategies, 'start match tiebreak');
    }

    execute() {
        this.strategies.matchCommandStrategy.startMatchTiebreak();
    }

    undo() {
        this.strategies.matchCommandStrategy.undoStartMatchTiebreak();
    }

}

class StartSet extends MatchCommand {
    constructor(strategies) {
        super(strategies, `start set[${strategies.matchCommandStrategy.match.sets.count}]`);
    }

    execute() {
        this.strategies.matchCommandStrategy.startSet()
    }

    undo() {
        this.strategies.matchCommandStrategy.undoStartSet()
    }

}

// Other commands
class UndoOperation {
    constructor(invoker) {
        this.invoker = invoker;
        this._title = `undo ${invoker.undoableCommand.title}`;
    }

    execute() {
        this.invoker.undo(this);
    }

    get title() {
        return this._title;
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

export {
    StartWarmup, StartPlay,
    StartSet, StartMatchTiebreak,
    StartGame, StartSetTiebreak, WinMatchTiebreak,
    WinGame, WinSetTiebreak, StartOver, UndoOperation
}

