'use strict';

class MatchOptions {
    static scoring = {
        eightGameProSet: 'eightgame',
        twoSetsTenPoint: 'twoSetsTenPoint',
        threeSets: 'threeSets'
    };

    static kind = {
        doubles: 'doubles',
        singles: 'singles'
    };

    static kinds = [MatchOptions.kind.singles, MatchOptions.kind.doubles];

    static players = 'players';

    static playerCount(options) {
        return MatchOptions.doublesKind(options) ? 4 : 2;
    }

    static doublesKind(options) {
        return options.kind == MatchOptions.kind.doubles;
    }
}

export {MatchOptions}