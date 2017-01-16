'use strict';


import {Match} from './model'
import 'aurelia-polyfills';
import {makeOptional} from './di-util'

class ServingStrategy {
}

class BasicServingStrategy extends ServingStrategy {
    static inject() {
        return makeOptional([Match]);
    }

    constructor(match) {
        super();
        this.opponents = match.opponents;
        this.servers = match.servers;
    }

    get knowServingOrder() {
        return this.servers.players.count >= this._opponentPlayerCount / 2;
    }

    get lastServerId() {
        return this.servers.value.lastServerId;

    }

    set _lastServerId(id) {
        this.servers.value.lastServerId = id;
    }

    * serverChoices() {
        if (!this.knowServingOrder) {
            for (let opponent of this.opponents) {
                if (!this._hasOpponentServed(opponent)) {
                    yield* opponent.players;
                }
            }
        }
    }

    removeLastServer() {
        this.servers.players.removeLast();
        this._updateServingOrder()
    }

    newServer(playerId) {
        if (!playerId) {
            if (!this.knowServingOrder) {
                throw new Error('player must be specified');
            }
            this._lastServerId = this._nextServerId;
        }
        else if (!this.knowServingOrder) {
            if (this._hasPlayerServed(playerId)) {
                throw new Error('player serving out of order')
            }
            this.servers.players.add().id = playerId;
            this._lastServerId = playerId;
            this._updateServingOrder();
        }
    }

    get _opponentPlayerCount() {
        return [...this.opponents.first.players].length + [...this.opponents.second.players].length;
    }

    _hasPlayerServed(player) {
        return this.servers.players.containsValue({id: player.id});
    }

    _hasOpponentServed(opponent) {
        for (let player of opponent.players) {
            if (this._hasPlayerServed(player)) {
                return true;
            }
        }
    }

    _updateServingOrder() {
        // Once the half the players have served, the serving is calculated
        if (this.knowServingOrder) {
            const playerId = this.servers.players.last.id;
            const servingOrder = [...this.servers.players].map((value) => value.id);
            let opponent = this._opponentOfPlayer(playerId);
            while (servingOrder.length < this._opponentPlayerCount) {
                opponent = this._nextOpponent(opponent);
                for (let player of opponent.players) {
                    if (servingOrder.indexOf(player.id) < 0)
                        servingOrder.push(player.id);
                }
            }
            this.servers.servingOrder = servingOrder;
        } else {
            this.servers.servingOrder = undefined;
        }
    }

    _opponentOfPlayer(playerId) {
        for (let opponent of this.opponents) {
            if (opponent.players.containsValue({id: playerId})) {
                return opponent;
            }
        }
    }

    _nextOpponent(opponent) {
        return (opponent === this.opponents.first) ? this.opponents.second : this.opponents.first;
    }

    get _nextServerId() {
        if (!this.knowServingOrder) {
            throw new Error('next server not known');
        }
        let next;
        let players = this.servers.servingOrder;
        let last = this.lastServerId;
        if (!last)
            return players[0];
        for (let i = 0; i < players.length; i++) {
            if (players[i] === last) {
                next = i + 1;
                break;
            }
        }
        if (next)
            return players[next % players.length];
    }
}

export {
    ServingStrategy, BasicServingStrategy,
}