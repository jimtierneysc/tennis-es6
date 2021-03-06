'use strict';
import {MatchObservable} from './observable';
import {MatchComponent, MatchComponentList} from './component';
import {MatchOptions} from './options'

/**
 * Match model.
 * A Match contains a list of MatchSet.
 * MatchSet contains a list of SetGame.
 * A Match has two opponents.
 * An Opponent has references to player id(s).
 * Match, MatchSet and SetGame may have a winning opponent.
 * Match and MatchSet have a score.
 */

class SetGame extends MatchComponent {

    get winnerId() {
        return this.value.winner;
    }

    set winnerId(opponentId) {
        if (this.value.winner != opponentId) {
            this.value.winner = opponentId;
            this.owner.observable.changeWinner(this);
        }
    }

    get finished() {
        return this.winnerId;
    }

    get inProgress() {
        return !this.finished;
    }

    get matchTiebreak() {
        return this.value.matchTiebreak;
    }

    set matchTiebreak(value) {
        this.value.matchTiebreak = value;
    }

    get setTiebreak() {
        return this.value.setTiebreak;
    }

    set setTiebreak(value) {
        this.value.setTiebreak = value;
    }
}

class SetGames extends MatchComponentList {
    factory(owner, value) {
        return new SetGame(owner, value);
    }
}

const _games = new WeakMap();
class MatchSet extends MatchComponent {
    constructor(parent, value) {
        super(parent, value);
        _games.set(this, new SetGames(this.owner, this.initArray('games')));
        this.initValue('scores', [0, 0]);
        this.initValue('winner', undefined);
    }

    get games() {
        return _games.get(this);
    }

    get winnerId() {
        return this.value.winner;

    }

    set winnerId(opponentId) {
        if (this.value.winner != opponentId) {
            this.value.winner = opponentId;
            this.owner.observable.changeWinner(this);
        }
    }

    get scores() {
        return this.value.scores;
    }

    set scores(value) {
        this.value.scores = value;
        this.owner.observable.changeScores(this);
    }

    get finished() {
        return this.winnerId;
    }

    get inProgress() {
        return !this.finished;
    }
}

class MatchSets extends MatchComponentList {
    factory(owner, value) {
        return new MatchSet(owner, value);
    }
}

class PlayerRef extends MatchComponent {
    get id() {
        return this.value.id;
    }

    set id(value) {
        this.value.id = value;
    }
}

class PlayerRefList extends MatchComponentList {
    factory(owner, value) {
        return new PlayerRef(owner, value);
    }
}

const _players = new WeakMap();

class PlayerRefs extends MatchComponent {

    constructor(parent, value) {
        super(parent, value);
        _players.set(this, new PlayerRefList(this.owner, this.initArray('players')));
    }

    get players() {
        return _players.get(this);
    }

    clear() {
        this.players.clear();
    }
}

class Servers extends PlayerRefs {
}

class Opponent extends PlayerRefs {

    constructor(parent, value, id) {
        super(parent, value);
        this.value.id = id;
    }

    get id() {
        return this.value.id;
    }

}

const _first = new WeakMap();
const _second = new WeakMap();

class Opponents extends MatchComponent {
    constructor(parent, value) {
        super(parent, value || {});
        _first.set(this, new Opponent(this.owner, this.initObj('first'), 1));
        _second.set(this, new Opponent(this.owner, this.initObj('second'), 2));
    }

    get first() {
        return _first.get(this);
    }

    get second() {
        return _second.get(this);
    }

    * [Symbol.iterator]() {
        yield this.first;
        yield this.second;
    }

    * players() {
        yield * this.first.players;
        yield * this.second.players;
    }

    findPlayerRef(id) {
        return [...this.players()].find((player)=>player.id === id)
    }

    findOpponent(id) {
        switch(id) {
            case 1:
                return this.first;
            case 2:
                return this.second;
        }
    }
}

const _sets = new WeakMap();
const _servers = new WeakMap();
const _opponents = new WeakMap();

class Match extends MatchComponent {

    constructor(value, options) {
        super(undefined, value || {options: options || {}});
        _sets.set(this, new MatchSets(this, this.initArray('sets')));
        _servers.set(this, new Servers(this, this.initObj('servers')));
        const hasOpponents = this.value.opponents;
        _opponents.set(this, new Opponents(this, this.initObj('opponents')));
        this.initValue('scores', [0, 0]);
        this.initValue('warmingUp', undefined);
        this.initValue('winner', undefined);
        this.observable = new MatchObservable();
        if (!hasOpponents) {
            this.addOpponents();
        }
    }


    addOpponents() {
        const players = this.options.players || [];
        const playerCount = MatchOptions.playerCount(this.options);

        if (players.length < playerCount || players.length > playerCount) {
            throw new Error(`Incorrect player count. ${playerCount} are required. ${players.length} are provided.`)
        }

        const map = new Map();
        let opponent = this.opponents.first;
        for (let i = 1; i <= playerCount && i <= players.length; i++) {
            const player = players[i - 1];
            if (map.get(player.id)) {
                throw new Error('Duplicate players not allowed')
            }
            map.set(player.id, true);
            opponent.players.add().id = player.id;
            if (i === playerCount / 2) {
                opponent = this.opponents.second;
            }
        }
    }

    get options() {
        return this.value.options || {};
    }


    get started() {
        return this.sets.count > 0;
    }

    get finished() {
        return this.winnerId;
    }

    get inProgress() {
        return this.started && !this.finished;
    }

    get warmingUp() {
        return this.value.warmingUp && !this.started;
    }

    set warmingUp(value) {
        this.value.warmingUp = value;
    }

    get sets() {
        return _sets.get(this);
    }

    get servers() {
        return _servers.get(this);
    }

    get opponents() {
        return _opponents.get(this);
    }

    get winnerId() {
        return this.value.winner;
    }

    set winnerId(winner) {
        if (this.value.winner != winner) {
            this.value.winner = winner;
            this.observable.changeWinner(this);
        }
    }

    get scores() {
        return this.value.scores;
    }

    set scores(value) {
        this.value.scores = value;
        this.observable.changeScores(this);
    }
}

export {Match, MatchSet, SetGame}
