/**
 * Test tennis match classes
 */

import {expect} from 'chai';
import {matchFactory} from '../src/match/match-factory';
import {MatchCharacteristics} from '../src/match/match-characteristics'


describe('servingStrategy', () => {

    describe('initialization', ()=>
    {
        describe('singles', () => {
            let playableMatch;
            let servingStrategy;
            beforeEach(() => {
                playableMatch = matchFactory.makeMatch();
                servingStrategy = playableMatch.commandStrategy.servingStrategy;
            });

            it('should have servingStrategy', () => {
                expect(servingStrategy).to.exist;
            });

            it('should should not be known', () => {
                expect(servingStrategy.areServersKnown).not.to.be.true;
            });

            it('should have server choices', () => {
                expect([...servingStrategy.serverChoices()].length).to.be.equal(2);
            });

        });

        describe('doubles', () => {
            let playableMatch;
            let servingStrategy;
            beforeEach(() => {
                playableMatch = matchFactory.makeMatch(MatchCharacteristics.TwoSetDoubles);
                servingStrategy = playableMatch.commandStrategy.servingStrategy;
            });

            it('should have server choices', () => {
                expect([...servingStrategy.serverChoices()].length).to.be.equal(4);
            });
        });
    });

    describe('serve', () => {
        describe('singles', () => {
            let playableMatch;
            let servingStrategy;
            let players;
            beforeEach(() => {
                playableMatch = matchFactory.makeMatch();
                servingStrategy = playableMatch.commandStrategy.servingStrategy;
                players = [...playableMatch.match.players.list];
                servingStrategy.addServer(players[0]);
            });

            it('should know server', () => {
                expect(servingStrategy.areServersKnown).to.be.true;
            });

            it('should not have more server choices', () => {
                expect([...servingStrategy.serverChoices()].length).to.be.equal(0);
            });

            it('should have all servers', () => {
                expect([...playableMatch.match.servers.players].length).to.be.equal(2);
            });

            it('should have lastServer', () => {
                expect(servingStrategy.lastServerId).to.be.equal(players[0].id)
            });

            describe('second server', () => {
                beforeEach(() => {
                    servingStrategy.addServer();
                });

                it('should have lastServer', () => {
                    expect(servingStrategy.lastServerId).to.be.equal(players[1].id)
                });

                describe('third server', () => {
                    beforeEach(() => {
                        servingStrategy.addServer();
                    });

                    it('should have lastServer', () => {
                        expect(servingStrategy.lastServerId).to.be.equal(players[0].id)
                    });
                });
            });
        });

        describe('doubles', () => {
            let playableMatch;
            let servingStrategy;
            let players;
            beforeEach(() => {
                playableMatch = matchFactory.makeMatch(MatchCharacteristics.TwoSetDoubles);
                servingStrategy = playableMatch.commandStrategy.servingStrategy;
                players = [...playableMatch.match.players.list];
                servingStrategy.addServer(players[0]);
            });

            it('should not know servers', () => {
                expect(servingStrategy.areServersKnown).to.be.false;
            });

            it('should have more server choices', () => {
                expect([...servingStrategy.serverChoices()].length).to.be.equal(2);
            });

            it('should have lastServer', () => {
                expect(servingStrategy.lastServerId).to.be.equal(players[0].id)
            });

            describe('second server', () => {
                beforeEach(() => {
                    servingStrategy.addServer(players[2]);
                });
                it('should know servers', () => {
                    expect(servingStrategy.areServersKnown).to.be.true;
                });

                it('should not have more server choices', () => {
                    expect([...servingStrategy.serverChoices()].length).to.be.equal(0);
                });

                it('should have all servers', () => {
                    expect([...playableMatch.match.servers.players].length).to.be.equal(4);
                });

                it('should have lastServer', () => {
                    expect(servingStrategy.lastServerId).to.be.equal(players[2].id)
                });

                describe('third server', () => {
                    beforeEach(() => {
                        servingStrategy.addServer();
                    });

                    it('should have lastServer', () => {
                        expect(servingStrategy.lastServerId).to.be.equal(players[1].id)
                    });

                    describe('fourth server', () => {
                        beforeEach(() => {
                            servingStrategy.addServer();
                        });

                        it('should have lastServer', () => {
                            expect(servingStrategy.lastServerId).to.be.equal(players[3].id)
                        });

                        describe('fifth server', () => {
                            beforeEach(() => {
                                servingStrategy.addServer();
                            });

                            it('should have lastServer', () => {
                                expect(servingStrategy.lastServerId).to.be.equal(players[0].id)
                            });
                        })

                    })
                })
            })
        });
    });

});


