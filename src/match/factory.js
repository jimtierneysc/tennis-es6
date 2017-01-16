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

export let createNewMatch = MatchFactory.createNew;
export let createMatchFromValue = MatchFactory.createFromValue;
