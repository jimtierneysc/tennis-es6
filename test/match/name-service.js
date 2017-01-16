/**
 * Test tennis match classes
 */

import {expect} from 'chai';
import {Utils as util} from './command-util';
import {PlayerNameService, OpponentNameService} from '../../src/match/name-service'
import {createFromFactory} from '../../src/match/di-util'
import {MatchOptions} from '../../src/match/options'
import {createNewMatch} from '../../src/match/factory'
import {createPlayableMatch} from '../../src/match/playable-factory'

const testParams = util.testParams;


describe('player-name-service', () => {

    let playableMatch;

    beforeEach(() => {
        let options = {
            kind: MatchOptions.kind.singles,
            players: [{id: 100}, {id: 200}]
        };
        let match = createNewMatch(options);
        playableMatch = createPlayableMatch(match,
            (container) => {
                const playerNameService = createFromFactory(container, PlayerNameService);
                playerNameService.idToName = (id) => `name${id}`;
                container.registerInstance(PlayerNameService, playerNameService);
            });
    });

    describe('members', () => {

        it('should have playerNameService', () => {
            expect(playableMatch.playerNameService).to.exist;
        });

        it('should get first player name', () => {
            expect(playableMatch.playerNameService.getPlayerName(100)).to.equal('name100');
        });

        it('should get second player name', () => {
            expect(playableMatch.playerNameService.getPlayerName(200)).to.equal('name200');
        });

        it('should not get non exist player name', () => {
            expect(playableMatch.playerNameService.getPlayerName(999)).not.to.exist;
        });


    })
});

describe('opponent-name-service', () => {

    function createMatch(options, createPlayerNameService) {
        const match = createNewMatch(options);
        const result = createPlayableMatch(match,
            (container) => {
                // TODO: Allow OppponentNameService to be created before PlayerNameService
                if (createPlayerNameService) {
                    createPlayerNameService(container);
                }
                const opponentNameService = createFromFactory(container, OpponentNameService);
                container.registerInstance(OpponentNameService, opponentNameService);
            });
        return result;
    }

    function createPlayerNameService(container) {
        const playerNameService = createFromFactory(container, PlayerNameService);
        playerNameService.idToName = (id) => `name${id}`;
        container.registerInstance(PlayerNameService, playerNameService);
    }

    describe('singles', () => {
        let playableMatch;
        let options;

        beforeEach(() => {
            options = {
                kind: MatchOptions.kind.singles,
                players: [{id: 100}, {id: 200}]
            };
            playableMatch = createMatch(options);
        });

        it('should have opponentNameService', () => {
            expect(playableMatch.opponentNameService).to.exist;
        });

        it('should get first opponent name', () => {
            expect(playableMatch.opponentNameService.getOpponentName(1)).to.equal('100');
        });

        it('should get second opponent name', () => {
            expect(playableMatch.opponentNameService.getOpponentName(2)).to.equal('200');
        });

        it('should not get non exist opponent name', () => {
            expect(playableMatch.opponentNameService.getOpponentName(999)).not.to.exist;
        });
        describe('with player name service', () => {

            beforeEach(()=> {
                playableMatch = createMatch(options, createPlayerNameService);
            });

            it('should get first opponent name', () => {
                expect(playableMatch.opponentNameService.getOpponentName(1)).to.equal('name100');
            });

            it('should get second opponent name', () => {
                expect(playableMatch.opponentNameService.getOpponentName(2)).to.equal('name200');
            });
        });
    });

    describe('doubles', () => {
        let playableMatch;
        let options;

        beforeEach(() => {
            options = {
                kind: MatchOptions.kind.doubles,
                players: [{id: 100}, {id: 200}, {id: 300}, {id: 400}]
            };
            playableMatch = createMatch(options);
        });

        it('should get first opponent name', () => {
            expect(playableMatch.opponentNameService.getOpponentName(1)).to.equal('100 and 200');
        });

        it('should get second opponent name', () => {
            expect(playableMatch.opponentNameService.getOpponentName(2)).to.equal('300 and 400');
        });

        describe('with player name service', () => {

            beforeEach(()=> {
                playableMatch = createMatch(options, createPlayerNameService);
            });

            it('should get first opponent name', () => {
                expect(playableMatch.opponentNameService.getOpponentName(1)).to.equal('name100 and name200');
            });

            it('should get second opponent name', () => {
                expect(playableMatch.opponentNameService.getOpponentName(2)).to.equal('name300 and name400');
            });
        });
    });
});



