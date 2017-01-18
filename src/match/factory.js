'use strict';
import {Match} from './model'

/**
 * Factory of Match model
 */

class MatchFactory {

    /**
     * Creates an instance of a Match from options
     * @param options The match options.
     * @return The Match instance.
     */
    static createNew(options) {
        return new Match(undefined, options);
    }

    /**
     * Creates an instance of a Match from a JSON value
     * @param value The serialized representation of the match
     * @return The Match instance.
     */
    // Not used, yet
    // static createFromValue(value) {
    //     return new Match(value);
    // }
 }

export const createNewMatch = MatchFactory.createNew;
// export const createFromValue = MatchFactory.createFromValue;
