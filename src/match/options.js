'use strict';

class MatchOptions {
    static scoring = {
        eightGameProSet: 'eight-game-pro-set',
        twoSetsTenPoint: 'two-sets-ten-point-tiebreak',
        threeSets: 'three-sets'
    };

    static kind = {
        doubles: 'doubles',
        singles: 'singles'
    };

    static kinds = [MatchOptions.kind.singles, MatchOptions.kind.doubles];

    static scorings = [MatchOptions.scoring.eightGameProSet, MatchOptions.scoring.twoSetsTenPoint, MatchOptions.scoring.threeSets]

    static players = 'players';

    static playerCount(options) {
        return MatchOptions.doublesKind(options) ? 4 : 2;
    }

    static doublesKind(options) {
        return options.kind === MatchOptions.kind.doubles;
    }

    static winSetThreshold(options) {
        return options.scoring === MatchOptions.scoring.eightGameProSet ? 8 : 6;
    }

    static winMatchThreshold(options) {
        return options.scoring === MatchOptions.scoring.eightGameProSet ? 1 : 2;
    }

    static finalSetIsTiebreak(options) {
        return options.scoring === MatchOptions.scoring.twoSetsTenPoint ? true : false;
    }
}

export {MatchOptions}