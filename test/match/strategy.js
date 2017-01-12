import {expect} from 'chai';
import {playableMatchFactory} from '../../src/match/playable-factory';
import {Utils as util} from './command-util'


describe('servingStrategy', () => {

    describe('initialization', ()=>
    {
        describe('singles', () => {
            let playableMatch;
            let servingStrategy;
            beforeEach(() => {
                playableMatch = util.makeMatch();
                servingStrategy = playableMatch.servingStrategy;
            });

            it('should have servingStrategy', () => {
                expect(servingStrategy).to.exist;
            });

            it('should should not be known', () => {
                expect(servingStrategy.knowServingOrder).not.to.be.true;
            });

            it('should have server choices', () => {
                expect([...servingStrategy.serverChoices()].length).to.be.equal(2);
            });

        });

        // describe('doubles', () => {
        //     let playableMatch;
        //     let servingStrategy;
        //     beforeEach(() => {
        //         playableMatch = playableMatchFactory.makeMatch(MatchCharacteristics.TwoSetDoubles);
        //         servingStrategy = playableMatch.commandStrategy.servingStrategy;
        //     });
        //
        //     it('should have server choices', () => {
        //         expect([...servingStrategy.serverChoices()].length).to.be.equal(4);
        //     });
        // });
    });

    describe('serve', () => {
        describe('singles', () => {
            let playableMatch;
            let servingStrategy;
            let players;
            beforeEach(() => {
                playableMatch = util.makeMatch();
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

        // describe('doubles', () => {
        //     let playableMatch;
        //     let servingStrategy;
        //     let players;
        //     beforeEach(() => {
        //         playableMatch = playableMatchFactory.makeMatch(MatchCharacteristics.TwoSetDoubles);
        //         servingStrategy = playableMatch.commandStrategy.servingStrategy;
        //         players = [...playableMatch.match.players.list];
        //         servingStrategy.newServer(players[0].id);
        //     });
        //
        //     it('should not know servers', () => {
        //         expect(servingStrategy.knowServingOrder).to.be.false;
        //     });
        //
        //     it('should have more server choices', () => {
        //         expect([...servingStrategy.serverChoices()].length).to.be.equal(2);
        //     });
        //
        //     it('should have lastServer', () => {
        //         expect(servingStrategy._lastServerId).to.be.equal(players[0].id)
        //     });
        //
        //     describe('second server', () => {
        //         beforeEach(() => {
        //             servingStrategy.newServer(players[2].id);
        //         });
        //         it('should know servers', () => {
        //             expect(servingStrategy.knowServingOrder).to.be.true;
        //         });
        //
        //         it('should not have more server choices', () => {
        //             expect([...servingStrategy.serverChoices()].length).to.be.equal(0);
        //         });
        //
        //         it('should have all servers', () => {
        //             expect(servingStrategy.servingOrder.length).to.be.equal(4);
        //         });
        //
        //         it('should have lastServer', () => {
        //             expect(servingStrategy._lastServerId).to.be.equal(players[2].id)
        //         });
        //
        //         describe('third server', () => {
        //             beforeEach(() => {
        //                 servingStrategy.newServer();
        //             });
        //
        //             it('should have lastServer', () => {
        //                 expect(servingStrategy._lastServerId).to.be.equal(players[1].id)
        //             });
        //
        //             describe('fourth server', () => {
        //                 beforeEach(() => {
        //                     servingStrategy.newServer();
        //                 });
        //
        //                 it('should have lastServer', () => {
        //                     expect(servingStrategy._lastServerId).to.be.equal(players[3].id)
        //                 });
        //
        //                 describe('fifth server', () => {
        //                     beforeEach(() => {
        //                         servingStrategy.newServer();
        //                     });
        //
        //                     it('should have lastServer', () => {
        //                         expect(servingStrategy._lastServerId).to.be.equal(players[0].id)
        //                     });
        //                 })
        //
        //             })
        //         })
        //     })
        // });
    });

});

