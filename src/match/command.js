// import {MatchStrategy} from './match-commandStrategy'

import {MatchCommandInvoker} from './command-invoker'
import {MatchCommandStrategy, SetCommandStrategy, GameCommandStrategy} from './strategy'
import {OpponentNameService, PlayerNameService} from './name-service'
import 'aurelia-polyfills';


class StartWarmup {
    static inject() {
        return [MatchCommandStrategy];
    }
    constructor(strategy) {
        this.title = 'start warmup';
        this.undo = ()=>strategy().undoStartWarmup();
        this.execute = ()=>strategy().startWarmup();
    }
}

class StartPlay  {
    static inject() {
        return [MatchCommandStrategy, PlayerNameService];
    }
    constructor(strategy, nameService, server) {
        let name = nameService.getPlayerName(server);
        this.title = `start play, server: ${name}`;
        this.execute = ()=>strategy().startPlay(server);
        this.undo = ()=>strategy().undoStartPlay(server);
    }

}

class WinGame  {
    static inject() {
        return [SetCommandStrategy, GameCommandStrategy, OpponentNameService];
    }
    constructor(setStrategy, gameStrategy, nameService, winnerId) {
        let name = nameService.getOpponentName(winnerId);
        this.title =
            `win game[${gameStrategy().game.index}], winner: ${name}`;
        this.execute = ()=>gameStrategy().winGame(winnerId);
        this.undo = ()=>setStrategy().undoWinGame();
    }
}

class WinSetTiebreak {
    static inject() {
        return [SetCommandStrategy, GameCommandStrategy, OpponentNameService];
    }
    constructor(setStrategy, gameStrategy, nameService, winnerId) {
        let name = nameService.getOpponentName(winnerId);
        this.title = `win set[${setStrategy().matchSet.index}] tiebreak, winner ${name}`;
        this.execute = ()=> gameStrategy().winGame(winnerId);
        this.undo = ()=> setStrategy().undoWinGame()
    }
}

class WinMatchTiebreak {
    static inject() {
        return [SetCommandStrategy, GameCommandStrategy, OpponentNameService];
    }
    constructor(setStrategy, gameStrategy, nameService, winnerId) {
        let name = nameService.getOpponentName(winnerId);
        this.title = `win match tiebreak, winner: ${name}`;
        this.execute = ()=> gameStrategy().winGame(winnerId);
        this.undo = ()=> setStrategy().undoWinGame();
    }
}

class StartGame {
    static inject() {
        return [SetCommandStrategy, PlayerNameService];
    }
    constructor(strategy, nameService, server) {
        this.title = `start game[${strategy().matchSet.games.count}]`;
        if (server) {
            let name = nameService.getPlayerName(server);
            this.title = `${title}, server: ${name}`
        }
        this.execute = ()=>strategy().startGame(server);
        this.undo = ()=>strategy().undoStartGame(server);
    }

}

class StartSetTiebreak {
    static inject() {
        return [SetCommandStrategy];
    }
    constructor(strategy) {
        this.title = `start set[${strategy().matchSet.index}] tiebreak`;
        this.undo = ()=> strategy().undoStartSetTiebreak();
        this.execute = ()=> strategy().startSetTiebreak();
    }
}

class StartMatchTiebreak {
    static inject() {
        return [MatchCommandStrategy];
    }
    constructor(strategy) {
        this.title = 'start match tiebreak';
        this.execute = ()=> strategy().startMatchTiebreak();
        this.undo = ()=> strategy().undoStartMatchTiebreak();
    }
}

class StartSet {
    static inject() {
        return [MatchCommandStrategy];
    }
    constructor(strategy) {
        this.title = `start set[${strategy().match.sets.count}]`;
        this.undo = ()=>strategy().undoStartSet();
        this.execute = ()=>strategy().startSet();
    }
}

class UndoOperation {
    static inject() {
        return [MatchCommandInvoker];
    }
    constructor(invoker) {
        this.title = `undo ${invoker.undoableCommand.title}`;
        this.execute = ()=> invoker.undo(this);
    }
}

class StartOver {
    static inject() {
        return [MatchCommandInvoker, MatchCommandStrategy];
    }

    constructor(invoker, strategy) {
        this.title = 'start over';
        this.execute = ()=> {
            strategy().startOver();
            invoker.clearCommands();
        }
    }
}

export {
    StartWarmup, StartPlay,
    StartSet, StartMatchTiebreak,
    StartGame, StartSetTiebreak, WinMatchTiebreak,
    WinGame, WinSetTiebreak, StartOver, UndoOperation
}

