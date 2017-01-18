'use strict';
import 'aurelia-polyfills';
import {Match} from './model'
import {makeOptional} from './di-util'


/**
 * Services for associating names with player id.
 */

// container for private members
const idToName = new Map();

/**
 * Associate a name with a single player id
 */
class PlayerNameService {
    static inject() {
        return makeOptional([Match]);
    }

    constructor(match) {
        this.match = match;
        this.idToName = (id)=>id.toString();
    }

    getPlayerName(playerId) {
        const player = this.match.opponents.findPlayerRef(playerId);
        if (player)
          return this.idToName(player.id);
    }

    get idToName() {
        return idToName.get(this);
    }

    // Use this property to replace the idToName method used by this service
    set idToName(fn) {
        idToName.set(this, fn);
    }
}

/**
 * Associate a name with an opponent.  An opponent my be a single player (singles),
 * or two players (doubles).
 */
class OpponentNameService {
    static inject() {
        return makeOptional([Match, PlayerNameService]);
    }

    constructor(match, playerNameService) {
        this.match = match;
        this.playerNameService = playerNameService;
    }

    getOpponentName(opponentId) {
        const opponent = this.match.opponents.findOpponent(opponentId);
        if (opponent) {
            const players = [...opponent.players];
            const names = players.map((player) => this.playerNameService ? this.playerNameService.getPlayerName(player.id) : player.id.toString());
            return names.join(' and ');
        }
    }
}

export {PlayerNameService, OpponentNameService}
