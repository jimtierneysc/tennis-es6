import {expect} from 'chai';
import {playableMatchFactory} from '../../src/match/playable-factory';
import {MatchOptions} from '../../src/match/options';
import {Utils as util} from './command-util'

let testParams = util.testParams;

describe('servingStrategy', () => {

    describe('initialization', () => {
        testParams.forEach((params) => {
            describe(params.title, () => {
                let playableMatch;
                let servingStrategy;
                beforeEach(() => {
                    playableMatch = util.makeMatch(params.options);
                    servingStrategy = playableMatch.servingStrategy;
                });

                it('should have servingStrategy', () => {
                    expect(servingStrategy).to.exist;
                });

                it('should should not be known', () => {
                    expect(servingStrategy.knowServingOrder).not.to.be.true;
                });

                it('should have server choices', () => {
                    expect([...servingStrategy.serverChoices()].length).to.be.equal(MatchOptions.playerCount(params.options));
                });

            });
        });

     });

    describe('serve', () => {
        describe('singles', () => {
            let playableMatch;
            let servingStrategy;
            let players;
            beforeEach(() => {
                playableMatch = util.makeMatch(util.singlesOptions);
                servingStrategy = playableMatch.servingStrategy;
                players = [...playableMatch.match.opponents.players()];
                servingStrategy.newServer(players[0].id);
            });

            it('should know server', () => {
                expect(servingStrategy.knowServingOrder).to.be.true;
            });

            it('should not have more server choices', () => {
                expect([...servingStrategy.serverChoices()].length).to.be.equal(0);
            });

            it('should have all servers', () => {
                expect(playableMatch.match.servers.servingOrder.length).to.be.equal(2);
            });

            it('should have lastServer', () => {
                expect(servingStrategy.lastServerId).to.be.equal(players[0].id)
            });

            describe('second server', () => {
                beforeEach(() => {
                    servingStrategy.newServer();
                });

                it('should have lastServer', () => {
                    expect(servingStrategy.lastServerId).to.be.equal(players[1].id)
                });

                describe('third server', () => {
                    beforeEach(() => {
                        servingStrategy.newServer();
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
                playableMatch = util.makeMatch(util.doublesOptions);
                servingStrategy = playableMatch.servingStrategy;
                players = [...playableMatch.match.opponents.players()];
                servingStrategy.newServer(players[0].id);
            });

            it('should not know servers', () => {
                expect(servingStrategy.knowServingOrder).to.be.false;
            });

            it('should have more server choices', () => {
                expect([...servingStrategy.serverChoices()].length).to.be.equal(2);
            });

            it('should have lastServer', () => {
                expect(servingStrategy.lastServerId).to.be.equal(players[0].id)
            });

            describe('second server', () => {
                beforeEach(() => {
                    servingStrategy.newServer(players[2].id);
                });
                it('should know servers', () => {
                    expect(servingStrategy.knowServingOrder).to.be.true;
                });

                it('should not have more server choices', () => {
                    expect([...servingStrategy.serverChoices()].length).to.be.equal(0);
                });

                it('should have all servers', () => {
                    expect(playableMatch.match.servers.servingOrder.length).to.be.equal(4);
                });

                it('should have lastServer', () => {
                    expect(servingStrategy.lastServerId).to.be.equal(players[2].id)
                });

                describe('third server', () => {
                    beforeEach(() => {
                        servingStrategy.newServer();
                    });

                    it('should have lastServer', () => {
                        expect(servingStrategy.lastServerId).to.be.equal(players[1].id)
                    });

                    describe('fourth server', () => {
                        beforeEach(() => {
                            servingStrategy.newServer();
                        });

                        it('should have lastServer', () => {
                            expect(servingStrategy.lastServerId).to.be.equal(players[3].id)
                        });

                        describe('fifth server', () => {
                            beforeEach(() => {
                                servingStrategy.newServer();
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


