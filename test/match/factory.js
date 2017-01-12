/**
 * Test tennis match classes
 */

import {expect} from 'chai';
import {createPlayableMatch} from '../../src/match/playable-factory';
import {createNewMatch, createMatchFromValue} from '../../src/match/factory';
import {Utils as util} from './command-util';


describe('factories', () => {

    it('should have new playable factory', () => {
        expect(createPlayableMatch).to.exist
    });
    it('should have new match factory', () => {
        expect(createNewMatch).to.exist
    });
    it('should have value match factory', () => {
        expect(createMatchFromValue).to.exist
    });
});

describe('playableMatch', () => {
    let playableMatch;

    beforeEach(() => {
        playableMatch = util.makeMatch();
    });

    it('should have match', () => {
        expect(playableMatch.match).to.exist;
    });

    it('should have commandInvoker', () => {
        expect(playableMatch.commandInvoker).to.exist;
    });

    it('should have matchCommands', () => {
        expect(playableMatch.matchCommands).to.exist;
    });

    it('should have matchSetCommands', () => {
        expect(playableMatch.matchSetCommands).to.exist;
    });

    it('should have setGameCommands', () => {
        expect(playableMatch.setGameCommands).to.exist;
    });

});

// describe('players', () => {
//
//     describe('singles', () => {
//         let playableMatch;
//
//         beforeEach(() => {
//             playableMatch = makeMatch();
//         });
//
//         it('should have two players', () => {
//             expect(playableMatch.match.players.list.count).to.be.equal(2);
//         });
//     });
//
//     describe('doubles', () => {
//         let playableMatch;
//
//         beforeEach(() => {
//             playableMatch = makeMatch();
//         });
//     });
// });

describe('opponents', () => {

    describe('singles', () => {
        let playableMatch;

        beforeEach(() => {
            playableMatch = util.makeMatch();
        });

        it('should have two opponents', () => {
            expect([...playableMatch.match.opponents].length).to.be.equal(2);
        });

        describe('players per opponent', () => {
            it('should have one player', () => {
                expect([...playableMatch.match.opponents.first.players].length).to.be.equal(1);
            });
            it('should have one player', () => {
                expect([...playableMatch.match.opponents.second.players].length).to.be.equal(1);
           });
        });
    });

    // describe('doubles', () => {
    //     let playableMatch;
    //
    //     beforeEach(() => {
    //         playableMatch = playableMatchFactory.makeMatch(MatchCharacteristics.TwoSetDoubles);
    //     });
    //
    //     it('should have two opponents', () => {
    //         expect([...playableMatch.match.opponents].length).to.be.equal(2);
    //     });
    //
    //     describe('players per opponent', () => {
    //         it('should have two players', () => {
    //             expect([...playableMatch.match.opponents.first.players].length).to.be.equal(2);
    //         });
    //         it('should have two players', () => {
    //             expect([...playableMatch.match.opponents.second.players].length).to.be.equal(2);
    //         });
    //     });
    // });
});



