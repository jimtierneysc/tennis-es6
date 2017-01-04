

class MatchCharacteristics {

    static Kinds = {
        SINGLES: 'SINGLES',
        DOUBLES: 'DOUBLES',
    };

    static Scoring = {
        TWOSETS: 'TWOSETS',
        THREESETS: 'THREESETS'
    };

    static TwoSetSingls = {
        kind: MatchCharacteristics.Kinds.SINGLES,
        scoring: MatchCharacteristics.Scoring.TWOSETS
    };

    static TwoSetDoubles = {
        kind: MatchCharacteristics.Kinds.DOUBLES,
        scoring: MatchCharacteristics.Scoring.TWOSETS
    };

    static ThreeSetSingls = {
        kind: MatchCharacteristics.Kinds.SINGLES,
        scoring: MatchCharacteristics.Scoring.THREESETS
    };

    static ThreeSetDoubles = {
        kind: MatchCharacteristics.Kinds.DOUBLES,
        scoring: MatchCharacteristics.Scoring.THREESETS
    }
}

export {MatchCharacteristics}

