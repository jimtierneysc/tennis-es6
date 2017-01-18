'use strict';

import {Container} from 'aurelia-dependency-injection';
import {CommandDecorator} from './command-decorator'
import {OpponentNameService, PlayerNameService} from './name-service'
import {createFromFactory, makeOptional} from './di-util'
import 'aurelia-polyfills';

/**
 * Command title decorators
 *
 * Add a title property to specific command classes.
 */

class DecorateStartWarmup {

    decorate(command) {
        command.title = 'start warmup';
    }
}

class DecorateStartPlay {
    static inject() {
        return makeOptional([PlayerNameService]);
    }

    constructor(nameService) {
        this.nameService = nameService;
    }

    decorate(command) {
        const name = this.nameService ? this.nameService.getPlayerName(command.server) : command.server;command.title = `start play, server: ${name}`;
    }

}

class DecorateWinGame {
    static inject() {
        return makeOptional([OpponentNameService]);
    }

    constructor(nameService) {
        this.nameService = nameService;
    }

    decorate(command) {
        const name = this.nameService ? this.nameService.getOpponentName(command.winnerId) : command.winnerId;
        command.title = `win game[${command.setGame.index}], winner: ${name}`;
    }
}

class DecorateWinSetTiebreak {
    static inject() {
        return makeOptional([OpponentNameService]);
    }

    constructor(nameService) {
        this.nameService = nameService;
    }

    decorate(command) {
        const name = this.nameService ? this.nameService.getOpponentName(command.winnerId) : command.winnerId;
        command.title = `win set[${command.matchSet.index}] tiebreak, winner ${name}`;
    }
}

class DecorateWinMatchTiebreak {
    static inject() {
        return makeOptional([OpponentNameService]);
    }

    constructor(nameService) {
        this.nameService = nameService;
    }

    decorate(command) {
        const name = this.nameService ? this.nameService.getOpponentName(command.winnerId) : command.winnerId;
        command.title = `win match tiebreak, winner: ${name}`;
    }
}

class DecorateStartGame {
    static inject() {
        return makeOptional([PlayerNameService]);
    }

    constructor(nameService) {
        this.nameService = nameService;
    }

    decorate(command) {
        let title = `start game[${command.matchSet.games.count}]`;
        if (command.server) {
            const name = this.nameService ? this.nameService.getPlayerName(command.server) : command.server;
            title = `${title}, server: ${name}`
        }
        command.title = title;
    }
}

class DecorateStartSetTiebreak {
    decorate(command) {
        command.title = `start set[${command.matchSet.index}] tiebreak`;
    }
}

class DecorateStartMatchTiebreak {
    decorate(command) {
        command.title = 'start match tiebreak';
    }
}

class DecorateStartSet {

    decorate(command) {
        command.title = `start set[${command.match.sets.count}]`;
    }
}

class DecorateUndoOperation {
    decorate(command) {
        const title = command.command.title;
        command.title = `undo ${title}`;
    }
}

class DecorateStartOver {
    decorate(command) {
        command.title = 'start over';
    }
}

class CommandTitleDecorator extends CommandDecorator {

    classLookup(klass) {
        if (!CommandTitleDecorator.map) {
            const map = new Map();
            // It would be nice if the keys could be the actually classes, but this doesn't seem to work
            map.set('StartWarmup', DecorateStartWarmup);
            map.set('StartPlay', DecorateStartPlay);
            map.set('StartSet', DecorateStartSet);
            map.set('StartMatchTiebreak', DecorateStartMatchTiebreak);
            map.set('StartGame', DecorateStartGame);
            map.set('StartSetTiebreak', DecorateStartSetTiebreak);
            map.set('WinMatchTiebreak', DecorateWinMatchTiebreak);
            map.set('WinGame', DecorateWinGame);
            map.set('WinSetTiebreak', DecorateWinSetTiebreak);
            map.set('StartOver', DecorateStartOver);
            map.set('UndoOperation', DecorateUndoOperation);
            CommandTitleDecorator.map = map;
        }
        return CommandTitleDecorator.map.get(klass);
    }

    static inject() {
        return makeOptional([Container]);
    }

    constructor(container) {
        super();
        this.container = container;
    }

    // override
    decorate(command) {
        const klass = this.classLookup(command.constructor.name);
        if (!klass) {
            throw new Error(`${command.constructor.name} not found.`)
        }
        const decorator = createFromFactory(this.container, klass);
        decorator.decorate(command)
    }
}

export {
    CommandTitleDecorator
}



