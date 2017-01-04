/**
 * Test tennis match classes
 */

import {expect} from 'chai';
import {Match} from '../src/match/match-entity';

describe('Match', () => {

    const listNames = ['sets', 'players', 'games'];

    function getList(match, name) {
        const fn = {
            sets() {
                return match.sets;
            },
            players() {
                return match.players.list;
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

    describe('constructor()', () => {

        let match;

        beforeEach(() => {
            match = new Match();
        });

        // it('should have singles', () => {
        //     expect(match.singles).not.to.be.undefined;
        // });
        //
        // it('should have doubles', () => {
        //     expect(match.doubles).not.to.be.undefined;
        // });

        it('should have scores', () => {
            expect(match.scores).to.be.eql([0, 0]);
        });

        it('should not have winnerId', () => {
            expect(match.winnerId).not.to.exist;
        });

        it('should have sets', () => {
            expect(match.sets).not.to.be.undefined;
        });

        it('should have players', () => {
            expect(match.players).not.to.be.undefined;
        });

    });

    describe('removeLast', () => {
        let obj;

        for (const member of listNames) {
            beforeEach(() => {
                const match = new Match();
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

    describe('constructor(value)', () => {
        let match;

        beforeEach(() => {
            match = new Match({
                scores: [1, 2],
                winner: 1,
                sets: [{
                    winner: 1,
                    scores: [3, 4],
                    games: [
                        {
                            winner: 2
                        }
                    ]
                }]
            });
        });

        it('should have scores', () => {
            expect(match.scores).to.be.eql([1, 2]);
        });

        it('should have winner', () => {
            expect(match.winnerId).to.be.equal(1);
        });

        it('should have sets', () => {
            expect(match.sets).to.exist;
        });

        it('should have one set', () => {
            expect(match.sets.count).to.equal(1);
        });

        it('should have set score', () => {
            expect(match.sets.last.scores).to.eql([3, 4]);
        });

        it('should have set winner', () => {
            expect(match.sets.last.winnerId).to.equal(1);
        });

        it('should be started', () => {
            expect(match.started).to.exist;
        });

        it('should have one game', () => {
            expect(match.sets.last.games.count).to.equal(1);
        });

        it('should have game winner', () => {
            expect(match.sets.last.games.last.winnerId).to.equal(2);
        });


    });

    describe('iterate', () => {

        for (const member of listNames) { // eslint-disable-line
            describe(member, () => {
                let obj;
                beforeEach(() => {
                    let match = new Match();
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
                    const match = new Match();
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

    describe('Player.name', () => {
        let player;
        beforeEach(() => {
            const match = new Match();
            player = match.players.list.add();
        });

        it('is blank', () => {
            expect(player.name).to.be.equal('');
        });

        it('can be set', () => {
            player.name = 'test';
            expect(player.name).to.be.equal('test');
        });

        it('can be cleared', () => {
            player.name = undefined;
            expect(player.name).to.be.equal('');
        });

    });

    describe('Player.id', () => {
        let players;
        beforeEach(() => {
            players = new Match().players;
        });

        it('has id 1', () => {
            players.list.add();
            expect(players.list.last.id).to.be.equal(1);
        });

        it('has id 2', () => {
            players.list.add();
            players.list.add();
            expect(players.list.last.id).to.be.equal(2);
        });

    });

    describe('Server.id', () => {
        let server;
        beforeEach(() => {
            const match = new Match();
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
            const match = new Match();
            opponents = match.opponents;
        });

        it('has first', () => {
            expect(opponents.first.players.count).to.be.equal(0);
        });

        it('has second', () => {
            expect(opponents.second.players.count).to.be.equal(0);
        });

        it('has first players', () => {
            opponents.first.players.add();
            expect(opponents.first.players.count).to.be.equal(1);
        });

        it('has second players', () => {
            opponents.second.players.add();
            opponents.second.players.add();
            expect(opponents.second.players.count).to.be.equal(2);
        });

        describe('contains', () => {
            beforeEach(() => {
                opponents.first.players.add().id = 1;
                opponents.first.players.add().id = 2;
                opponents.second.players.add().id = 3;
                opponents.second.players.add().id = 4;
            });

            it('first contains', () => {
                expect(opponents.first.players.containsValue({id: 2})).to.be.true;
            });
            it('first does not contain', () => {
                expect(opponents.first.players.containsValue({id: 3})).not.to.be.true;
            });
            it('second contains', () => {
                expect(opponents.second.players.containsValue({id: 3})).to.be.true;
            });
            it('second does not contain', () => {
                expect(opponents.second.players.containsValue({id: 2})).not.to.be.true;
            });
        });
    });

});
