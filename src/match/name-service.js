'use strict';
import 'aurelia-polyfills';
import {Match} from './entity'

const idToName = new Map();

class PlayerNameService {
    static inject() {
        return [Match];
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
        return [Match, PlayerNameService];
    }

    constructor(match, playerNameService) {
        this.match = match;
        this.playerNameService = playerNameService;
    }

    getWinnerName(winnerId) {
        return this.getOpponentName(winnerId);
    }

    getOpponentName(opponentId) {
        let opponent = this.match.opponents.findOpponent(opponentId);
        if (opponent) {
            let players = [...opponent.players];
            let names = players.map((player) => this.playerNameService.getPlayerName(player.id));
            return names.join(' and ');
        }
    }
}

export {PlayerNameService, OpponentNameService}
