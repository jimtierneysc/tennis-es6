import {Match} from './match-entity'
class MatchFactory {

    static createNew(options) {
        return new Match(undefined, options);
    }

    static createFromValue(value) {
        return new Match(value);
    }
 }

export let createNewMatch = MatchFactory.createNew;
export let createMatchFromValue = MatchFactory.createFromValue;
