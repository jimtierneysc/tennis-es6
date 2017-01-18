'use strict';
import {UndoOperation, StartOver} from './command'
import {Match} from './model';
import {MatchHistory} from './history';
import {MatchCommandInvoker} from './command-invoker'
import {MatchController, SetGameController, MatchSetController} from './controller'
import {ServingStrategy} from './serving'
import {PlayerNameService, OpponentNameService} from './name-service'
import {createCommand} from './command-factory'
import {
    Optional
} from 'aurelia-dependency-injection';

/**
 * PlayableMatch creates the services to "play" a match by modifying the Match model.
 * Services include controllers to provide commands
 * that operate on a match, and an invoker to execute commands.
 */
class PlayableMatch {

    constructor(container) {
        this.container = container;
    }

    get match() {
        return this.optionalOf(Match);
    }

    get commandInvoker() {
        return this.optionalOf(MatchCommandInvoker);
    }

    get matchController() {
        return this.optionalOf(MatchController)();
    }

    get setGameController() {
        return this.optionalOf(SetGameController)();
    }

    get matchSetController() {
        return this.optionalOf(MatchSetController)();
    }

    get servingStrategy() {
        return this.optionalOf(ServingStrategy)();
    }

    get history() {
        return this.optionalOf(MatchHistory);
    }

    get playerNameService() {
        return this.optionalOf(PlayerNameService);
    }

    get opponentNameService() {
        return this.optionalOf(OpponentNameService);
    }

    *otherCommands() {
        if (this.commandInvoker.canUndo) {
            yield createCommand(this.container, UndoOperation);
        }

        if (this.matchController.canStartOver) {
            yield createCommand(this.container, StartOver);
        }
    }

    * allCommands() {
        yield* this.setGameCommands();
        yield* this.matchSetCommands();
        yield* this.matchCommands();
        yield* this.otherCommands();
    }

    matchCommands() {
        return this.matchController.commands();
    }

    matchSetCommands() {
        return this.matchSetController.commands();
    }

    setGameCommands() {
        return this.setGameController.commands();
    }

    optionalOf(klass) {
        return Optional.of(klass).get(this.container);
    }

}

export {PlayableMatch}

