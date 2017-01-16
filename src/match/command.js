// import {MatchStrategy} from './match-commandStrategy'
'use strict';

import {MatchCommandInvoker} from './command-invoker'
import {MatchController, MatchSetController, SetGameController} from './controller'
import {makeOptional} from './di-util'
import 'aurelia-polyfills';


class StartWarmup {
    static inject() {
        return makeOptional([MatchController]);
    }
    constructor(strategy) {
        this.match = strategy().match;
        this.undo = ()=>strategy().undoStartWarmup();
        this.execute = ()=>strategy().startWarmup();
    }
}

class StartPlay  {
    static inject() {
        return makeOptional([MatchController]);
    }
    constructor(strategy, server) {
        this.match = strategy().match;
        this.server = server;
        this.execute = ()=>strategy().startPlay(server);
        this.undo = ()=>strategy().undoStartPlay(server);
    }

}

class WinGame  {
    static inject() {
        return makeOptional([MatchSetController, SetGameController]);
    }
    constructor(setStrategy, gameStrategy, winnerId) {
        this.setGame = gameStrategy().game;
        this.winnerId = winnerId;
        this.execute = ()=>gameStrategy().winGame(winnerId);
        this.undo = ()=>setStrategy().undoWinGame();
    }
}

class WinSetTiebreak {
    static inject() {
        return makeOptional([MatchSetController, SetGameController]);
    }
    constructor(setStrategy, gameStrategy, winnerId) {
        this.matchSet = setStrategy().matchSet;
        this.winnerId = winnerId;
        this.execute = ()=> gameStrategy().winGame(winnerId);
        this.undo = ()=> setStrategy().undoWinGame()
    }
}

class WinMatchTiebreak {
    static inject() {
        return makeOptional([MatchSetController, SetGameController]);
    }
    constructor(setStrategy, gameStrategy, winnerId) {
        this.setGame = gameStrategy().game;
        this.winnerId = winnerId;
        this.execute = ()=> gameStrategy().winGame(winnerId);
        this.undo = ()=> setStrategy().undoWinGame();
    }
}

class StartGame {
    static inject() {
        return makeOptional([MatchSetController]);
    }
    constructor(strategy, server) {
        this.server = server;
        this.matchSet = strategy().matchSet;
        this.execute = ()=>strategy().startGame(server);
        this.undo = ()=>strategy().undoStartGame(server);
    }
}

class StartSetTiebreak {
    static inject() {
        return makeOptional([MatchSetController]);
    }
    constructor(strategy) {
        this.matchSet = strategy().matchSet;
        this.undo = ()=> strategy().undoStartSetTiebreak();
        this.execute = ()=> strategy().startSetTiebreak();
    }
}

class StartMatchTiebreak {
    static inject() {
        return makeOptional([MatchController]);
    }
    constructor(strategy) {
        this.match = strategy().match;
        this.execute = ()=> strategy().startMatchTiebreak();
        this.undo = ()=> strategy().undoStartMatchTiebreak();
    }
}

class StartSet {
    static inject() {
        return makeOptional([MatchController]);
    }
    constructor(strategy) {
        this.match = strategy().match;
        this.undo = ()=>strategy().undoStartSet();
        this.execute = ()=>strategy().startSet();
    }
}

class UndoOperation {
    static inject() {
        return makeOptional([MatchCommandInvoker]);
    }
    constructor(invoker) {
        this.command = invoker.undoableCommand;
        this.execute = ()=> invoker.undo(this);
    }
}

class StartOver {
    static inject() {
        return makeOptional([MatchCommandInvoker, MatchController]);
    }

    constructor(invoker, strategy) {
        this.match = strategy().match;
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

