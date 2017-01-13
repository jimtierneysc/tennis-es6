'use strict';
import {
    EventEmitter
} from 'events';

class MatchObservable {
    static events = {
        changeScores: 'changeScores',
        changeWinner: 'changeWinner'
    };

    constructor() {
        this._emitter = new EventEmitter();
    }

    get emitter() {
        return this._emitter;
    }

    changeScores(entity) {
        // console.log(`changeScores ${entity.constructor.name}`);
        this.emitter.emit(MatchObservable.events.changeScores, entity);
    }

    changeWinner(entity) {
        // console.log(`changeWinner ${entity.constructor.name}`);
        this.emitter.emit(MatchObservable.events.changeWinner, entity);
    }

    subscribeScores(fn) {
        this.emitter.on(MatchObservable.events.changeScores, fn);

    }

    unSubscribeScores(fn) {
        this.emitter.removeListener(MatchObservable.events.changeScores, fn);

    }

    subscribeWinner(fn) {
        this.emitter.on(MatchObservable.events.changeWinner, fn);

    }

    unSubscribeWinner(fn) {
        this.emitter.removeListener(MatchObservable.events.changeWinner, fn);

    }
}

export {MatchObservable};

