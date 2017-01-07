/**
 * Classes to record tennis match score
 */
// import * as _ from 'lodash'
import {matchObservable} from './match-observable';
import {ScoreComponent, ScoreComponentList} from './match-component';

// // TODO: Parent vs. Owner
// class ScoreComponent {
//     constructor(owner, value) {
//         this._childList = undefined;
//         this._owner = owner;
//         this._value = value || {};
//         if (owner) {
//             this._owner.addChild(this);
//         }
//     }
//
//     initValue(member, defValue) {
//         if (!(member in this.value)) {
//             this.value[member] = defValue;
//         }
//         return this.value[member];
//     }
//
//     initArray(member) {
//         return this.initValue(member, []);
//     }
//
//     initObj(member) {
//         return this.initValue(member, {});
//     }
//
//     get owner() {
//         return this._owner;
//     }
//
//     get value() {
//         return this._value;
//     }
//
//     childRemoved(component) { // virtual
//
//     }
//
//     childAdded(component) {
//
//     }
//
//     removeChild(component) {
//         this.childRemoved(component);
//     }
//
//     // TODO: Set owner, remove from previous owner
//     addChild(component) {
//         this.childAdded(component);
//     }
//
//     isEqualValue(value) {
//         return _.isEqual(value, this.value);
//     }
//
//     get index() {
//         if (this.owner && this.owner.indexOf) {
//             return this.owner.indexOf(this)
//         }
//     }
//
// }
//
// class ScoreComponentList extends ScoreComponent {
//     constructor(owner, value) {
//         super(owner, value || []);
//         this._childList = [];
//         this.constructChildren();
//     }
//
//     constructChildren() {
//         this.value.forEach((i) => this.factory(i));
//     }
//
//     removeChild(component) {
//         const i = this._childList.indexOf(component);
//         if (i >= 0) {
//             this._childList.splice(i, 1);
//             this.childRemoved(component);
//         }
//     }
//
//     // TODO: Set owner, remove from previous owner
//     addChild(component) {
//         this._childList.push(component);
//         this.childAdded(component);
//     }
//
//     childRemoved(component) {
//         const i = this.value.indexOf(component.value);
//         if (i >= 0) {
//             this.value.splice(i, 1);
//         }
//     }
//
//     // Override
//     childAdded(component) {
//         const i = this.value.indexOf(component.value);
//         if (i < 0) {
//             this.value.push(component.value);
//         }
//     }
//
//     get count() {
//         return this._childList.length;
//     }
//
//     get last() {
//         const len = this._childList.length;
//         if (len > 0)
//             return this._childList[len - 1];
//     }
//
//     removeLast() {
//         const item = this.last;
//         if (item) {
//             this.removeChild(item);
//         }
//     }
//
//     * [Symbol.iterator]() {
//         for (const arg of this._childList) {
//             yield arg;
//         }
//     }
//
//     add() {
//         const result = this.factory();
//         return result;
//     }
//
//     factory(value) {
//         // TODO: Raise exception
//         return null;
//     }
//
//     containsValue(value) {
//         for (let i of this) {
//             if (i.isEqualValue(value)) {
//                 return true;
//             }
//         }
//     }
//
//     contains(entity) {
//         for (let i of this) {
//             if (i === entity) {
//                 return true;
//             }
//         }
//     }
//
//     indexOf(entity) {
//         let index = 0;
//         for (let i of this) {
//             if (i === entity) {
//                 return index;
//             }
//             index++;
//         }
//     }
//
//     clear() {
//         while(this.count) {
//             this.removeLast();
//         }
//     }
//
// }

class SetGame extends ScoreComponent {

    constructor(owner, value) {
        super(owner, value);
    }

    // get matchSet() {
    //     return this.owner.owner;
    // }

    get winnerId() {
        return this.value.winner;

    }

    set winnerId(opponentId) {
        // console.log(`set winner: ${opponentId}`);
        if (this.value.winner != opponentId) {
            this.value.winner = opponentId;
            matchObservable.changeWinner(this);
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

class SetGames extends ScoreComponentList {
    factory(value) {
        return new SetGame(this, value);
    }
}

class MatchSet extends ScoreComponent {
    constructor(owner, value) {
        super(owner, value);
        this._games = new SetGames(this, this.initArray('games'));
        // TODO: Initialize winner and scores
        this.initValue('scores', [0, 0]);
        this.initValue('winner', undefined);
    }

    // get match() {
    //     // TODO: Parent vs. owner
    //     return this.owner.owner;
    // }

    get games() {
        return this._games;
    }

    get winnerId() {
        return this.value.winner;

    }

    set winnerId(opponentId) {
        if (this.value.winner != opponentId) {
            this.value.winner = opponentId;
            matchObservable.changeWinner(this);
        }
    }

    get scores() {
        return this.value.scores;
    }

    set scores(value) {
        this.value.scores = value;
        matchObservable.changeScores(this);
    }

    get finished() {
        return this.winnerId;
    }

    get inProgress() {
        return !this.finished;
    }
}

class MatchSets extends ScoreComponentList {
    factory(value) {
        return new MatchSet(this, value);
    }
}

class Player extends ScoreComponent {

    constructor(owner, value) {
        super(owner, value || {id: owner.owner._nextId()});
    }

    get name() {
        return this.value.name || "";
    }

    set name(value) {
        this.value.name = value;
    }

    get id() {
        return this.value.id;
    }
}

class PlayerList extends ScoreComponentList {
    factory(value) {
        return new Player(this, value);
    }

}

class Players extends ScoreComponent {
    constructor(owner, value) {
        super(owner, value || {lastId: 0});
        this._list = new PlayerList(this, this.initArray('list'));
    }

    get list() {
        return this._list;
    }

    get idCounter() {
        return this.value.idCounter || 1;
    }

    set idCounter(value) {
        this.value.idCounter = value;
    }

    _nextId() {
        let result = this.idCounter;
        this.idCounter = result + 1;
        return result;
    }
}

class PlayerRef extends ScoreComponent {

    get id() {
        return this.value.id;
    }

    set id(value) {
        this.value.id = value;
    }
}

class PlayerRefList extends ScoreComponentList {
    factory(value) {
        return new PlayerRef(this, value);
    }
}

class PlayerRefs extends ScoreComponent {

    constructor(owner, value) {
        super(owner, value);
        this._players = new PlayerRefList(this, this.initArray('players'));
    }

    get players() {
        return this._players;
    }

    clear() {
        this.players.clear();
    }

}

class Servers extends PlayerRefs {
}

class Opponent extends PlayerRefs {

    constructor(owner, value, id) {
        super(owner, value);
        this.value.id = id;
    }


    get id() {
        return this.value.id;
    }

}

class Opponents extends ScoreComponent {
    constructor(owner, value) {
        super(owner, value || {});
        this._first = new Opponent(this, this.initObj('first'), 1);
        this._second = new Opponent(this, this.initObj('second'), 2);
    }

    get first() {
        return this._first;
    }

    get second() {
        return this._second;
    }

    * [Symbol.iterator]() {
        yield this._first;
        yield this._second;
    }

}

class Match extends ScoreComponent {

    constructor(value) {
        super(undefined, value);
        this._sets = new MatchSets(this, this.initArray('sets'));
        this._players = new Players(this, this.initObj('players'));
        this._servers = new Servers(this, this.initObj('servers'));
        this._opponents = new Opponents(this, this.initObj('opponents'));
        this.initValue('scores', [0, 0]);
        this.initValue('warmingUp', undefined);
        this.initValue('winner', undefined);
    }

    // get singles() {
    //     return this.players.count === 2;
    // }
    //
    // get doubles() {
    //     return this.players.count === 4;
    // }

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

    get strategy() {
        return this._commandStrategy;
    }

    set warmingUp(value) {
        this.value.warmingUp = value;
    }

    get sets() {
        return this._sets;
    }

    get players() {
        return this._players;
    }

    get servers() {
        return this._servers;
    }

    get opponents() {
        return this._opponents;
    }

    get winnerId() {
        return this.value.winner;
    }

    set winnerId(winner) {
        if (this.value.winner != winner) {
            this.value.winner = winner;
            matchObservable.changeWinner(this);
        }
    }

    get scores() {
        return this.value.scores;
    }

    set scores(value) {
        this.value.scores = value;
        matchObservable.changeScores(this);
    }
}

export {Match, MatchSet, SetGame}
