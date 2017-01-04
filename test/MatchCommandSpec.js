/**
 * Test tennis match classes
 */

import {expect} from 'chai';
import {matchFactory} from '../src/match/match-factory';
import {
    StartWarmup, StartPlay, StartOver, StartSet, StartMatchTiebreak,
    StartGame, StartSetTiebreak, WinMatchTiebreak,
    WinGame, WinSetTiebreak, UndoOperation
} from '../src/match/match-command';
import {MatchCharacteristics} from '../src/match/match-characteristics'


function findCommand(commands, type) {
    return commands.find((value) => value instanceof type);
}

function filterCommands(commands, type) {
    return commands.filter((value) => {
        return value instanceof type
    });
}

function startASet(playableMatch) {
    let commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
    if (commands.length > 0)
        playableMatch.commandInvoker.invoke(commands[0]); // start play
    commands = filterCommands([...playableMatch.matchCommands()], StartSet);
    if (commands.length > 0)
        playableMatch.commandInvoker.invoke(commands[0]); // start set
}

function startWarmup(playableMatch) {
    let commands = filterCommands([...playableMatch.matchCommands()], StartWarmup);
    playableMatch.commandInvoker.invoke(commands[0]); // start warmup
}

function startPlay(playableMatch) {
    let commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
    playableMatch.commandInvoker.invoke(commands[0]); // start play
}

function winGames(playableMatch, opponent, count) {
    startASet(playableMatch);
    while (count--) {
        let commands = filterCommands([...playableMatch.matchSetCommands()], StartGame);
        if (commands.length > 0)
            playableMatch.commandInvoker.invoke(commands[0]);
        commands = filterCommands([...playableMatch.setGameCommands()], WinGame);
        if (commands.length > 0)
            playableMatch.commandInvoker.invoke(commands[opponent - 1]);
        else
            throw new Error('can\'t win game');
    }
}

function winSet(playableMatch, opponent) {
    startASet(playableMatch);
    while (!playableMatch.match.sets.last.winnerId) {
        winGames(playableMatch, opponent, 1);
        // let commands = filterCommands([...playableMatch.setGameCommands()], WinGame);
        // playableMatch.commandInvoker.invoke(commands[opponent - 1]);
        // commands = filterCommands([...playableMatch.matchSetCommands()], StartGame);
        // if (commands.length > 0)
        //     playableMatch.commandInvoker.invoke(commands[0]);
    }
}

function winMatchTiebreak(playableMatch, opponent) {
    let commands = filterCommands([...playableMatch.matchCommands()], StartMatchTiebreak);
    if (commands.length === 0)
        throw new Error('Can\'t start match tiebreak');
    if (commands.length > 0)
        playableMatch.commandInvoker.invoke(commands[0]);
    commands = filterCommands([...playableMatch.setGameCommands()], WinMatchTiebreak);
    if (commands.length === 0)
        throw new Error('Can\'t win match tiebreak');
    playableMatch.commandInvoker.invoke(commands[opponent - 1]);
}

describe('makeMatch', () => {
    it('should have makeMatch', () => {
        expect(matchFactory.makeMatch).not.to.be.undefined;
    });
});

describe('playableMatch', () => {

    let playableMatch;

    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
    });

    it('should have commands', () => {
        expect(playableMatch.matchCommands).not.to.be.undefined;
    });
});

describe('matchCommands', () => {

    let commands = [];

    beforeEach(() => {
        let playableMatch = matchFactory.makeMatch();
        commands = [...playableMatch.matchCommands()]
    });


    it('should have commands', () => {
        expect(commands.length).to.be.greaterThan(0);
    });
});

describe('startWarmup', () => {

    let command;
    let playableMatch;

    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        command = findCommand([...playableMatch.matchCommands()], StartWarmup);
    });

    it('should have command', () => {
        expect(command).to.be.instanceOf(StartWarmup);
    });

    it('should not be warming up', () => {
        expect(playableMatch.match.warmingUp).not.to.be.true;
    });

    describe('invoke', () => {

        beforeEach(() => {
            playableMatch.commandInvoker.invoke(command);
        });

        it('should be warming up', () => {
            expect(playableMatch.match.warmingUp).to.be.true;
        });

        it('should no longer have command', () => {
            let command = findCommand([...playableMatch.matchCommands()], StartWarmup);
            expect(command).to.be.undefined;
        });
    })
});


describe('startPlay-doubles', () => {

    let commands;
    let playableMatch;

    beforeEach(() => {
        playableMatch = matchFactory.makeMatch(MatchCharacteristics.TwoSetDoubles);
        commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
    });

    it('should have commands', () => {
        expect(commands.length).to.equal(4);
    });

    describe('invoke', () => {

        beforeEach(() => {
            playableMatch.commandInvoker.invoke(commands[0]);
        });

        it('should have started match', () => {
            expect(playableMatch.match.started)
        });

        it('should have one set', () => {
            expect(playableMatch.match.sets.count).to.be.equal(1);
        });

        it('should have one game', () => {
            expect(playableMatch.match.sets.last.games.count).to.be.equal(1);
        });

        it('should have game in progress', () => {
            expect(playableMatch.match.sets.last.games.last.inProgress).to.be.true;
        });

        // it('should have active set', () => {
        //     expect(playableMatch.commandStrategy.activeSet).to.exist;
        // });
        //
        // it('should have active game', () => {
        //     expect(playableMatch.commandStrategy.activeGame).to.exist;
        // });

        it('should no longer have command', () => {
            let commands = [...playableMatch.matchCommands()].filter((value) => value instanceof StartPlay);
            expect(commands).to.be.empty;
        });
    })
});

describe('startPlay-singles', () => {
    let commands;
    let playableMatch;

    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
    });

    it('should have commands', () => {
        expect(commands.length).to.equal(2);
    });

});

describe('winGame', () => {
    let commands;
    let playableMatch;

    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
        playableMatch.commandInvoker.invoke(commands[0]);  // start play
        commands = filterCommands([...playableMatch.setGameCommands()], WinGame);
    });

    it('should have commands', () => {
        expect(commands.length).to.equal(2);
    });

    it('should award win to opponent 1', () => {
        playableMatch.commandInvoker.invoke(commands[0]);  // win game
        expect(playableMatch.match.sets.last.games.last.winnerId).to.be.equal(commands[0].winnerId);
    });

    it('should award win to opponent 2', () => {
        playableMatch.commandInvoker.invoke(commands[1]);  // win game
        expect(playableMatch.match.sets.last.games.last.winnerId).to.be.equal(commands[1].winnerId);
    });

});

describe('startGame-first-set', () => {
    let commands;
    let playableMatch;

    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
        playableMatch.commandInvoker.invoke(commands[0]);  // start play
        commands = filterCommands([...playableMatch.setGameCommands()], WinGame);
        playableMatch.commandInvoker.invoke(commands[0]);  // win game
        commands = filterCommands([...playableMatch.matchSetCommands()], StartGame);
    });

    it('should have commands', () => {
        expect(commands.length).to.equal(1);
    });

    describe('start-game-2', () => {
        beforeEach(() => {
            playableMatch.commandInvoker.invoke(commands[0]); // start play
        });

        it('should start game 2', () => {
            expect(playableMatch.match.sets.last.games.count).to.equal(2);
        });

        it('should have game in progress', () => {
            expect(playableMatch.match.sets.last.games.last.inProgress).to.be.true;
        });

        it('should have WinGame command', () => {
            commands = filterCommands([...playableMatch.setGameCommands()], WinGame);
            expect(commands.length).to.equal(2);
        });

        describe('start-game-3', () => {
            beforeEach(() => {
                commands = filterCommands([...playableMatch.setGameCommands()], WinGame);
                playableMatch.commandInvoker.invoke(commands[0]);  // win game
                commands = filterCommands([...playableMatch.matchSetCommands()], StartGame);
            });

            it('should have StartGame command', () => {
                expect(commands.length).to.equal(1);
            });

            it('should start game 3', () => {
                playableMatch.commandInvoker.invoke(commands[0]); // start game
                expect(playableMatch.match.sets.last.games.count).to.equal(3);
            });
        });
    });
});

describe('win-set-singles', () => {
    const playableMatch = matchFactory.makeMatch();
    const commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
    playableMatch.commandInvoker.invoke(commands[0]); // start play

    for (let i = 1; i <= 6; i++) {
        describe(`game-${i}`, () => {
            describe('start-game', () => {
                beforeEach(() => {
                    let commands = filterCommands([...playableMatch.matchSetCommands()], StartGame);
                    if (commands.length > 0)
                        playableMatch.commandInvoker.invoke(commands[0]); // start game
                });

                it('should have game in progress', () => {
                    expect(playableMatch.match.sets.last.games.last.inProgress).to.be.true;
                });

                describe('win-game', () => {
                    let commands;
                    beforeEach(() => {
                        commands = filterCommands([...playableMatch.setGameCommands()], WinGame);
                    });

                    it('should have win game command', () => {
                        expect(commands.length).to.be.equal(2);
                    });

                    it('should win game', () => {
                        playableMatch.commandInvoker.invoke(commands[0]); // win game
                        expect(playableMatch.match.sets.last.games.last.inProgress).not.to.be.true;
                    });

                    describe('set-won', () => {
                        it('should have correct score', () => {
                            expect(playableMatch.match.sets.last.scores).to.be.eql([i, 0]);
                        });
                        if (i === 6) {
                            describe(`game-${i}`, () => {
                                it('should not be in progress', () => {
                                    expect(playableMatch.match.sets.last.inProgress).not.to.be.true;
                                });

                                it('should have winner', () => {
                                    expect(playableMatch.match.sets.last.winnerId).to.exist;
                                })
                            })
                        } else {
                            describe(`game-${i}`, () => {
                                it('should be in progress', () => {
                                    expect(playableMatch.match.sets.last.inProgress).to.be.true;
                                });

                                it('should not have winner', () => {
                                    expect(playableMatch.match.sets.last.winnerId).not.to.exist;
                                });
                            })
                        }
                    });
                });
            })
        });
    }
});

describe('second-set-singles', () => {
    let playableMatch;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        const commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
        playableMatch.commandInvoker.invoke(commands[0]); // start play
        playableMatch.match.sets.last.winnerId = playableMatch.match.opponents.first.id;
    });

    it('should have StartSet command', () => {
        const commands = filterCommands([...playableMatch.matchCommands()], StartSet);
        expect(filterCommands(commands, StartSet).length).to.be.equal(1)
    });

    describe('invoke-StartSet', () => {
        beforeEach(() => {
            const commands = filterCommands([...playableMatch.matchCommands()], StartSet);
            playableMatch.commandInvoker.invoke(commands[0]);
        });

        // TODO: Put these in function to call share code
        it('should have two sets', () => {
            expect(playableMatch.match.sets.count).to.be.equal(2);
        });

        it('should have one games', () => {
            expect(playableMatch.match.sets.last.games.count).to.be.equal(1);
        });

        it('should have game in progress', () => {
            expect(playableMatch.match.sets.last.games.last.inProgress).to.be.true;
        });
    });
});


describe('match-tiebreak-singles', () => {
    let playableMatch;
    let commands;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        winSet(playableMatch, 1);
        winSet(playableMatch, 2);
        commands = filterCommands([...playableMatch.matchCommands()], StartMatchTiebreak);
    });

    it('should have command', () => {
        expect(commands.length).to.be.equal(1);
    });

    describe('start', () => {
        beforeEach(() => {
            playableMatch.commandInvoker.invoke(commands[0]);
        });

        it('should have started', () => {
            expect(playableMatch.match.sets.last.games.last.matchTiebreak).to.be.true;
        });

        describe('can-win', () => {
            beforeEach(() => {
                commands = filterCommands([...playableMatch.setGameCommands()], WinMatchTiebreak);
            });

            it('should have command', () => {
                expect(commands.length).to.be.equal(2);
            });

            describe('win', () => {
                beforeEach(() => {
                    playableMatch.commandInvoker.invoke(commands[0]);
               });

                it('should have won', () => {
                    expect(playableMatch.match.winnerId).to.be.equal(1);
                });
            })

        })
    })
});


describe('set-tiebreak-singles', () => {
    let playableMatch;
    let commands;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        winGames(playableMatch, 1, 5);
        winGames(playableMatch, 2, 6);
        winGames(playableMatch, 1, 1);
        commands = filterCommands([...playableMatch.matchSetCommands()], StartSetTiebreak);
    });

    it('should have command', () => {
        expect(commands.length).to.be.equal(1);
    });

    describe('start', () => {
        beforeEach(() => {
            playableMatch.commandInvoker.invoke(commands[0]);
        });

        it('should have started', () => {
            expect(playableMatch.match.sets.last.games.last.setTiebreak).to.be.true;
        });

        describe('can-win', () => {
            beforeEach(() => {
                commands = filterCommands([...playableMatch.setGameCommands()], WinSetTiebreak);
            });

            it('should have command', () => {
                expect(commands.length).to.be.equal(2);
            });

            describe('win', () => {
                beforeEach(() => {
                    playableMatch.commandInvoker.invoke(commands[0]);
                });

                it('should have won', () => {
                    expect(playableMatch.match.sets.last.winnerId).to.be.equal(1);
                });
            })

        })
    })
});


describe('win-match-singles', () => {
    let playableMatch;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        // let commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
        // playableMatch.commandInvoker.invoke(commands[0]); // start play
    });

    describe('in-2-sets', () => {
        beforeEach(() => {
            winSet(playableMatch, 1);
            winSet(playableMatch, 1);
        });
        it('should have won match', () => {
            expect(playableMatch.match.winnerId).to.be.equal(1);
        });
    });

    describe('in-3-sets', () => {
        beforeEach(() => {
            winSet(playableMatch, 1);
            winSet(playableMatch, 2);
            winMatchTiebreak(playableMatch, 2);
        });
        it('should have won match', () => {
            expect(playableMatch.match.winnerId).to.be.equal(2);
        });
    });

});


describe('start-over-singles', () => {
    let playableMatch;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        let commands = filterCommands([...playableMatch.matchCommands()], StartWarmup);
        playableMatch.commandInvoker.invoke(commands[0]); // start warmup
        // commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
        // playableMatch.commandInvoker.invoke(commands[0]); // start play
        winSet(playableMatch, 1);
        winSet(playableMatch, 1);
    });

    it('should have StartOver command', () => {
        const commands = filterCommands([...playableMatch.otherCommands()], StartOver);
        expect(filterCommands(commands, StartOver).length).to.be.equal(1)
    });

    describe('invoke', () => {
        beforeEach(() => {
            const commands = filterCommands([...playableMatch.otherCommands()], StartOver);
            playableMatch.commandInvoker.invoke(commands[0]);
        });

        it('should not have winner', () => {
            expect(playableMatch.match.winnerId).not.to.exist;
        });

        it('should have scores', () => {
            expect(playableMatch.match.scores).to.be.eql([0, 0]);
        });

        it('should not have sets', () => {
            expect(playableMatch.match.sets.count).to.be.equal(0);
        });

        it('should not be warming up', () => {
            expect(playableMatch.match.warmingUp).not.to.be.true;
        });
    });

});

describe.only('undo', () => {
    let playableMatch;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
    });

    describe('start-warmup', ()=>{
        let commands;
        beforeEach(()=>{
            startWarmup(playableMatch);
            commands = filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });

        it('should undo', ()=>{
            playableMatch.commandInvoker.invoke(commands[0]);
            expect(playableMatch.match.warmingUp).not.to.be.true;
        });

    });

    describe('start-play', ()=>{
        let commands;
        beforeEach(()=>{
            startPlay(playableMatch);
            commands = filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });

        describe('when-undo', ()=> {
            beforeEach(()=>{
                playableMatch.commandInvoker.invoke(commands[0]);
            });
            it('should not be started', ()=>{
                expect(playableMatch.match.started).not.to.be.true;
            });

            it('should have no sets', ()=>{
                expect(playableMatch.match.sets.count).to.be.equal(0);
            });
        });

    });

    describe('start-game', ()=>{
        let commands;
        beforeEach(()=>{
            startPlay(playableMatch);
            commands = filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });

        describe('when-undo', ()=> {
            beforeEach(()=>{
                playableMatch.commandInvoker.invoke(commands[0]);
            });
            it('should not be started', ()=>{
                expect(playableMatch.match.started).not.to.be.true;
            });

            it('should have no servers', ()=>{
                expect(playableMatch.match.servers.players.count).to.be.equal(0);
            });

            it('should have no sets', ()=>{
                expect(playableMatch.match.sets.count).to.be.equal(0);
            });
        });

    });
});



