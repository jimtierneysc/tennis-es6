// import {MatchStrategy} from './match-commandStrategy'

import {MatchCommandInvoker} from './match-command-invoker'
import {MatchCommandStrategy, SetCommandStrategy, GameCommandStrategy} from './match-strategy'
import 'aurelia-polyfills';

class StartWarmup {
    static inject() {
        return [MatchCommandStrategy];
    }
    constructor(strategy) {
        // this._strategy = strategy;
        this.title = 'start warmup';
        this.undo = ()=>strategy.undoStartWarmup();
        this.execute = ()=>strategy.startWarmup();
    }
}

class StartPlay  {
    static inject() {
        return [MatchCommandStrategy];
    }
    constructor(strategy, server) {
        this.title = `start play ${server}`;
        this.execute = ()=>strategy.startPlay(server);
        this.undo = ()=>strategy.undoStartPlay(server);
    }

}

class WinGame  {
    static inject() {
        return [SetCommandStrategy, GameCommandStrategy];
    }
    constructor(setStrategy, gameStrategy, winnerId) {
        this.title =
            `win game[${gameStrategy.game.index}] by ${winnerId}`;
        this.execute = ()=>gameStrategy.winGame(winnerId);
        this.undo = ()=>setStrategy.undoWinGame();
    }
}

class WinSetTiebreak {
    static inject() {
        return [SetCommandStrategy, GameCommandStrategy];
    }
    constructor(setStrategy, gameStrategy, winnerId) {
        this.title = `win set[${setStrategy.matchSet.index}] tiebreak by ${winnerId}`;
        this.execute = ()=> gameStrategy.winGame(winnerId);
        this.undo = ()=> setStrategy.undoWinGame()
    }
}

class WinMatchTiebreak {
    static inject() {
        return [SetCommandStrategy, GameCommandStrategy];
    }
    constructor(setStrategy, gameStrategy, winnerId) {
        this.title = `win match tiebreak ${winnerId}`;
        this.execute = ()=> gameStrategy.winGame(winnerId);
        this.undo = ()=> setStrategy.undoWinGame();
    }
}

class StartGame {
    static inject() {
        return [SetCommandStrategy];
    }
    constructor(strategy, server) {
        this.title = `start game[${strategy.matchSet.games.count}]`;
        this.execute = ()=>strategy.startGame(server);
        this.undo = ()=>strategy.undoStartGame(server);
    }

}

class StartSetTiebreak {
    static inject() {
        return [SetCommandStrategy];
    }
    constructor(strategy) {
        this.title = `start set[${strategy.matchSet.index}] tiebreak`;
        this.undo = ()=> strategy.undoStartSetTiebreak();
        this.execute = ()=> strategy.startSetTiebreak();
    }
}

class StartMatchTiebreak {
    static inject() {
        return [MatchCommandStrategy];
    }
    constructor(strategy) {
        this.title = 'start match tiebreak';
        this.execute = ()=> strategy.startMatchTiebreak();
        this.undo = ()=> strategy.undoStartMatchTiebreak();
    }
}

class StartSet {
    static inject() {
        return [MatchCommandStrategy];
    }
    constructor(strategy) {
        this.title = `start set[${strategy.match.sets.count}]`;
        this.undo = ()=>strategy.undoStartSet();
        this.execute = ()=>strategy.startSet();
    }
}

// Other commands
class UndoOperation {
    static inject() {
        return [MatchCommandInvoker];
    }
    constructor(invoker) {
        // this.invoker = invoker;
        this.title = `undo ${invoker.undoableCommand.title}`;
        this.execute = ()=> invoker.undo(this);
    }
}

class StartOver {
    constructor(fn) {
        this.title = 'start over';
        // this.fn = fn;
        this.execute = ()=>fn();
    }
}

export {
    StartWarmup, StartPlay,
    StartSet, StartMatchTiebreak,
    StartGame, StartSetTiebreak, WinMatchTiebreak,
    WinGame, WinSetTiebreak, StartOver, UndoOperation
}

