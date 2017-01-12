import {expect} from 'chai';
import {playableMatchFactory} from '../../src/match/playable-factory';
import {Match} from '../../src/match/entity';
import {Utils as util} from './command-util';


class compare {

    static error(message) {
        throw new Error(message);
    }

    static equal(value1, value2) {
        try {
            compare.opponents(value1.opponents, value2.opponents);
            // compare.players(value1.players, value2.players);
            compare.servers(value1.servers, value2.servers);
            compare.sets(value1.sets, value2.sets);
            compare.winner(value1, value2);
            compare.scores(value1, value2);
            return true;
        }
        catch (err) {
            return false;
        }
    }

    static iterate(value1, value2, fn) {
        var iterator1 = value1[Symbol.iterator]();
        var iterator2 = value2[Symbol.iterator]();
        while (true) {
            let next1 = iterator1.next();
            let next2 = iterator2.next();
            if (next1.done || next2.done) {
                break;
            }
            fn(next1.value, next2.value);

        }
    }

    static opponents(value1, value2) {
        if (value1.count != value2.count)
            compare.error('opponents');
        compare.iterate(value1, value2, (value1, value2) => compare.opponent(value1, value2))
    }

    static opponent(value1, value2) {
        compare.iterate(value1.players, value2.players, (value1, value2) => compare.playerRef(value1, value2))
    }

    // static players(value1, value2) {
    //     if (value1.list.count != value2.list.count)
    //         compare.error('players');
    //     if (value1.lastId != value2.lastId)
    //         compare.error('lastId');
    //     compare.iterate(value1.list, value2.list, (value1, value2) => compare.player(value1, value2))
    // }
    //
    // static player(value1, value2) {
    //     if (value1.id != value2.id)
    //         compare.error('server');
    // }

    static playerRef(value1, value2) {
        if (value1.id != value2.id)
            compare.error('server');
    }

    static servers(value1, value2) {
        if (value1.players.count != value2.players.count)
            compare.error('servers');
        if (value1._lastServerId != value2._lastServerId) {
            compare.error('_lastServerId');
        }
        compare.iterate(value1.players, value2.players, (value1, value2) => compare.playerRef(value1, value2))
    }


    static sets(value1, value2) {
        if (value1.count != value2.count)
            compare.error('sets');
        compare.iterate(value1, value2, (value1, value2) => compare.set(value1, value2))
    }

    static winner(value1, value2) {
        if (value1.winnerId != value2.winnerId)
            compare.error('winner');
    }

    static set(value1, value2) {
        compare.winner(value1, value2);
        compare.scores(value1, value2);
        compare.games(value1, value2);

    }

    static games(value1, value2) {
        if (value1.games.count != value2.games.count)
            compare.error('games');
        compare.iterate(value1.games, value2.games, (value1, value2) => compare.game(value1, value2))
    }

    static game(value1, value2) {
        compare.winner(value1, value2);
    }

    static scores(value1, value2) {
        if (value1.scores.length != value2.scores.length)
            compare.error('scores');
        compare.score(value1.scores[0], value2.scores[0]);
        compare.score(value1.scores[1], value2.scores[1]);
    }

    static score(value1, value2) {
        if (value1 != value2)
            compare.error('score');
    }

}

function matchFromValue(playableMatch) {
    // simulate save and reload
    let value = JSON.parse(JSON.stringify(playableMatch.match.value));
    return new Match(value);
}

describe('serialize', () => {

    let playableMatch;

    beforeEach(() => {
        playableMatch = util.makeMatch();
    });

    describe('empty match', () => {
        let match;
        beforeEach(() => {
            match = matchFromValue(playableMatch);
        });

        it('should have same value', () => {
            expect(compare.equal(match, playableMatch.match)).to.be.ok;
        });
    });

    describe('start match', () => {
        let match;
        beforeEach(() => {
            util.startPlay(playableMatch);
            match = matchFromValue(playableMatch);
        });

        it('should have same value', () => {
            expect(compare.equal(match, playableMatch.match)).to.be.ok;
        });
    });

    describe('win game', () => {
        let match;
        beforeEach(() => {
            util.startPlay(playableMatch);
            util.winGame(playableMatch, 1);
            match = matchFromValue(playableMatch);
        });

        it('should have same value', () => {
            expect(compare.equal(match, playableMatch.match)).to.be.ok;
        });
    });

    describe('win set', () => {
        let match;
        beforeEach(() => {
            util.startPlay(playableMatch);
            util.winSet(playableMatch, 1);
            match = matchFromValue(playableMatch);
        });

        it('should have same value', () => {
            expect(compare.equal(match, playableMatch.match)).to.be.ok;
        });
    });

    describe('win match', () => {
        let match;
        beforeEach(() => {
            util.startPlay(playableMatch);
            util.winSet(playableMatch, 1);
            util.winSet(playableMatch, 1);
            match = matchFromValue(playableMatch);
            // match.sets.last.scores[0] = 7;
        });

        it('should have same value', () => {
            expect(compare.equal(match, playableMatch.match)).to.be.ok;
        });
    });


});


