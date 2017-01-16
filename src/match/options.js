'use strict';

class MatchOptions {

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
MatchOptions.scoring = {
    eightGameProSet: 'eight-game-pro-set',
    twoSetsTenPoint: 'two-sets-ten-point-tiebreak',
    threeSets: 'three-sets'
};

MatchOptions.kind = {
    doubles: 'doubles',
    singles: 'singles'
};

MatchOptions.kinds = [MatchOptions.kind.singles, MatchOptions.kind.doubles];

MatchOptions.scorings = [MatchOptions.scoring.eightGameProSet, MatchOptions.scoring.twoSetsTenPoint, MatchOptions.scoring.threeSets]

MatchOptions.players = 'players';

export {MatchOptions}