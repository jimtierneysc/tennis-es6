'use strict';
import 'aurelia-polyfills';
import {Match} from './model'
import {createFromFactory, makeOptional} from './di-util'
import {
    Factory, Optional
} from 'aurelia-dependency-injection';

const idToName = new Map();

class PlayerNameService {
    static inject() {
        // Don't create match if not registered
        return makeOptional([Match]);
    }

    constructor(match) {
        this.match = match;
        this.idToName = (id)=>id.toString();
    }

    getPlayerName(playerId) {
        let player = this.match.opponents.findPlayerRef(playerId);
        if (player)
          return this.idToName(player.id);
    }

    get idToName() {
        return idToName.get(this);
    }

    // Replace idToName method
    set idToName(fn) {
        idToName.set(this, fn);
    }
}

class OpponentNameService {
    static inject() {
        return makeOptional([Match, PlayerNameService]);
    }

    constructor(match, playerNameService) {
        this.match = match;
        this.playerNameService = playerNameService;
    }

    getOpponentName(opponentId) {
        let opponent = this.match.opponents.findOpponent(opponentId);
        if (opponent) {
            let players = [...opponent.players];
            let names = players.map((player) => this.playerNameService ? this.playerNameService.getPlayerName(player.id) : player.id.toString());
            return names.join(' and ');
        }
    }
}

export {PlayerNameService, OpponentNameService}
