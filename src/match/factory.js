'use strict';
import {Match} from './model'
class MatchFactory {

    static createNew(options) {
        return new Match(undefined, options);
    }

    // Not used, yet
    // static createFromValue(value) {
    //     return new Match(value);
    // }
 }

export const createNewMatch = MatchFactory.createNew;
export const createMatchFromValue = MatchFactory.createFromValue;
