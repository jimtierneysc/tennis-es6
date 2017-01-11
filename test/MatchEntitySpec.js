/**
 * Test tennis match classes
 */

import {expect} from 'chai';
import {Match} from '../src/match/match-entity';

function createMatch() {
  return new Match(undefined, {players: [{id: 1}, {id: 2}]})

}

describe('Match', () => {

    const listNames = ['sets', 'games'];

    function getList(match, name) {
        const fn = {
            sets() {
                return match.sets;
            },
            servers() {
                return match.servers;
            },
            games() {
                if (match.sets.count === 0) {
                    match.sets.add();
                }
                return match.sets.last.games;
            }
        };

        return fn[name]();
    }

    describe('new-match', () => {

        let match;

        beforeEach(() => {
            match = createMatch();
        });

        it('should have scores', () => {
            expect(match.scores).to.be.eql([0, 0]);
        });

        it('should have opponents', () => {
            expect(match.opponents).to.exist;
        });

        it('should have servers', () => {
            expect(match.servers).to.exist;
        });

        it('should not have winnerId', () => {
            expect(match.winnerId).not.to.exist;
        });

        it('should have sets', () => {
            expect(match.sets).to.exist;
        });

        // it('should have players', () => {
        //     expect(match.players).to.exist;
        // });

    });

    describe('removeLast', () => {
        let obj;

        for (const member of listNames) {
            beforeEach(() => {
                const match = createMatch();
                obj = getList(match, member);
                obj.add();
                obj.add();

            });

            it(`should delete ${member}`, () => {
                obj.removeLast();
                expect(obj.count).to.equal(1);
            });
        }
    });

    describe('iterate', () => {

        for (const member of listNames) { // eslint-disable-line
            describe(member, () => {
                let obj;
                beforeEach(() => {
                    let match = createMatch()
                    obj = getList(match, member);
                });

                it('has zero items', () => {
                    let i = 0;
                    for (const item of obj) {
                        i++;
                    }
                    expect(i).to.be.equal(0);
                });

                it('has two items', () => {
                    obj.add();
                    obj.add();
                    let i = 0;
                    for (const item of obj) {
                        i++;
                    }
                    expect(i).to.be.equal(2);
                });

            });
        }
    });

    describe('add', () => {

        for (const member of listNames) {
            describe(member, () => {
                let obj;
                beforeEach(() => {
                    const match = createMatch()
                    obj = getList(match, member);
                });

                it(`adds 1 to ${member}`, () => {
                    obj.add();
                    expect(obj.count).to.be.equal(1);
                });

                it(`adds 2 to ${member}`, () => {
                    obj.add();
                    obj.add();
                    expect(obj.count).to.be.equal(2);
                });
            });
        }
    });

    // describe('Player.name', () => {
    //     let player;
    //     beforeEach(() => {
    //         const match = createMatch()
    //         player = match.players.list.add();
    //     });
    //
    //     it('is blank', () => {
    //         expect(player.name).to.be.equal('');
    //     });
    //
    //     it('can be set', () => {
    //         player.name = 'test';
    //         expect(player.name).to.be.equal('test');
    //     });
    //
    //     it('can be cleared', () => {
    //         player.name = undefined;
    //         expect(player.name).to.be.equal('');
    //     });
    //
    // });

    // describe('Player.id', () => {
    //     let players;
    //     beforeEach(() => {
    //         players = new Match().players;
    //     });
    //
    //     it('has id 1', () => {
    //         players.list.add();
    //         expect(players.list.last.id).to.be.equal(1);
    //     });
    //
    //     it('has id 2', () => {
    //         players.list.add();
    //         players.list.add();
    //         expect(players.list.last.id).to.be.equal(2);
    //     });
    //
    // });

    describe('Server.id', () => {
        let server;
        beforeEach(() => {
            const match = createMatch()
            server = match.servers.players.add();
        });

        it('is undefined', () => {
            expect(server.id).to.be.undefined;
        });

        it('can be set', () => {
            server.id = 1;
            expect(server.id).to.be.equal(1);
        });

        it('can be cleared', () => {
            server.id = undefined;
            expect(server.id).to.be.undefined;
        });

    });

    describe('Opponents', () => {
        let opponents;
        beforeEach(() => {
            const match = createMatch()
            opponents = match.opponents;
        });

        it('has first', () => {
            expect(opponents.first.players.count).to.be.equal(1);
        });

        it('has second', () => {
            expect(opponents.second.players.count).to.be.equal(1);
        });

        it('has first players', () => {
            expect(opponents.first.players.count).to.be.equal(1);
        });

        it('has second players', () => {
            expect(opponents.second.players.count).to.be.equal(1);
        });

        describe('contains', () => {

            it('should in first', () => {
                expect(opponents.first.players.containsValue({id: 1})).to.be.true;
            });
            it('should not in first', () => {
                expect(opponents.first.players.containsValue({id: 2})).not.to.be.true;
            });
            it('should in second', () => {
                expect(opponents.second.players.containsValue({id: 2})).to.be.true;
            });
            it('should not in second', () => {
                expect(opponents.second.players.containsValue({id: 1})).not.to.be.true;
            });
        });
    });

});
