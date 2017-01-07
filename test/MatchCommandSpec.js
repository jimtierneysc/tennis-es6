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
import {Utils as util} from './MatchCommandUtils';

// function findCommand(commands, type) {
//     return commands.find((value) => value instanceof type);
// }
//
// function filterCommands(commands, type) {
//     return commands.filter((value) => {
//         return value instanceof type
//     });
// }
//
// function tryStartSet(playableMatch) {
//     let commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
//     if (commands.length > 0)
//         playableMatch.commandInvoker.invoke(commands[0]); // start play
//     commands = filterCommands([...playableMatch.matchCommands()], StartSet);
//     if (commands.length > 0)
//         playableMatch.commandInvoker.invoke(commands[0]); // start set
// }
//
// function startWarmup(playableMatch) {
//     let commands = filterCommands([...playableMatch.matchCommands()], StartWarmup);
//     playableMatch.commandInvoker.invoke(commands[0]); // start warmup
// }
//
// function startPlay(playableMatch) {
//     let commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
//     playableMatch.commandInvoker.invoke(commands[0]); // start play
// }
//
// function tryStartGame(playableMatch) {
//     let commands = filterCommands([...playableMatch.matchSetCommands()], StartGame);
//     if (commands.length > 0)
//         playableMatch.commandInvoker.invoke(commands[0]);
// }
//
// function winGame(playableMatch, opponent) {
//     let commands = filterCommands([...playableMatch.setGameCommands()], WinGame);
//     if (commands.length > 0)
//         playableMatch.commandInvoker.invoke(commands[opponent - 1]);
//     else
//         throw new Error('can\'t win game');
// }
//
// function startSetTiebreak(playableMatch) {
//     let commands = filterCommands([...playableMatch.matchSetCommands()], StartSetTiebreak);
//     if (commands.length > 0)
//         playableMatch.commandInvoker.invoke(commands[0]);
//     else
//         throw new Error('can\'t start set tiebreak');
// }
//
// function winSetTiebreak(playableMatch, opponent) {
//     let commands = filterCommands([...playableMatch.setGameCommands()], WinSetTiebreak);
//     if (commands.length > 0)
//         playableMatch.commandInvoker.invoke(commands[opponent-1]);
//     else
//         throw new Error('can\'t win set tiebreak');
// }
//
// function winGames(playableMatch, opponent, count) {
//     tryStartSet(playableMatch);
//     while (count--) {
//         tryStartGame(playableMatch);
//         winGame(playableMatch, opponent);
//     }
// }
//
// function winSet(playableMatch, opponent) {
//     tryStartSet(playableMatch);
//     while (!playableMatch.match.sets.last.winnerId) {
//         winGames(playableMatch, opponent, 1);
//     }
// }
//
// function startMatchTiebreak(playableMatch) {
//     let commands = filterCommands([...playableMatch.matchCommands()], StartMatchTiebreak);
//     if (commands.length === 0)
//         throw new Error('Can\'t start match tiebreak');
//     playableMatch.commandInvoker.invoke(commands[0]);
// }
//
// function winMatchTiebreak(playableMatch, opponent) {
//     let commands = filterCommands([...playableMatch.setGameCommands()], WinMatchTiebreak);
//     if (commands.length === 0)
//         throw new Error('Can\'t win match tiebreak');
//     playableMatch.commandInvoker.invoke(commands[opponent - 1]);
// }
//
// function hasCommands(playableMatch, classes) {
//     let commands = [...playableMatch.allCommands()].map((value)=>value.constructor.name);
//     let result = classes.length === commands.length;
//     if (result) {
//         let classNames = classes.map((value)=>value.name);
//         result = commands.sort().join() === classNames.sort().join();
//     }
//     if (!result) {
//         let classNames = classes.map((value)=>value.name);
//         console.log(`commands: ${commands.sort().join(',')}`)
//         console.log(`classNames: ${classNames.sort().join(',')}`)
//     }
//     return result;
// }


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
        command = util.findCommand([...playableMatch.matchCommands()], StartWarmup);
    });

    it('should have command', () => {
        expect(command).to.be.instanceOf(StartWarmup);
    });

    it('should not be warming up', () => {
        expect(playableMatch.match.warmingUp).not.to.be.ok;
    });

    describe('invoke', () => {

        beforeEach(() => {
            playableMatch.commandInvoker.invoke(command);
        });

        it('should be warming up', () => {
            expect(playableMatch.match.warmingUp).to.be.true;
        });

        it('should no longer have command', () => {
            let command = util.findCommand([...playableMatch.matchCommands()], StartWarmup);
            expect(command).to.be.undefined;
        });
    })
});


// describe('startPlay-doubles', () => {
//
//     let commands;
//     let playableMatch;
//
//     beforeEach(() => {
//         playableMatch = matchFactory.makeMatch(MatchCharacteristics.TwoSetDoubles);
//         commands = filterCommands([...playableMatch.matchCommands()], StartPlay);
//     });
//
//     it('should have commands', () => {
//         expect(commands.length).to.equal(4);
//     });
//
//     describe('invoke', () => {
//
//         beforeEach(() => {
//             playableMatch.commandInvoker.invoke(commands[0]);
//         });
//
//         it('should have started match', () => {
//             expect(playableMatch.match.started)
//         });
//
//         it('should have one set', () => {
//             expect(playableMatch.match.sets.count).to.be.equal(1);
//         });
//
//         it('should have one game', () => {
//             expect(playableMatch.match.sets.last.games.count).to.be.equal(1);
//         });
//
//         it('should have game in progress', () => {
//             expect(playableMatch.match.sets.last.games.last.inProgress).to.be.true;
//         });
//
//         it('should no longer have command', () => {
//             let commands = [...playableMatch.matchCommands()].filter((value) => value instanceof StartPlay);
//             expect(commands).to.be.empty;
//         });
//     })
// });

describe('startPlay', () => {
    let commands;
    let playableMatch;

    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        commands = util.filterCommands([...playableMatch.matchCommands()], StartPlay);
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
        util.startPlay(playableMatch);
        commands = util.filterCommands([...playableMatch.setGameCommands()], WinGame);
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
        util.startPlay(playableMatch);
        util.winGame(playableMatch, 1);
        commands = util.filterCommands([...playableMatch.matchSetCommands()], StartGame);
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
            commands = util.filterCommands([...playableMatch.setGameCommands()], WinGame);
            expect(commands.length).to.equal(2);
        });

        describe('start-game-3', () => {
            beforeEach(() => {
                util.winGame(playableMatch, 1);
                commands = util.filterCommands([...playableMatch.matchSetCommands()], StartGame);
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

describe('win-set', () => {
    const playableMatch = matchFactory.makeMatch();
    util.startPlay(playableMatch);

    for (let i = 1; i <= 6; i++) {
        describe(`game-${i}`, () => {
            describe('start-game', () => {
                beforeEach(() => {
                    let commands = util.filterCommands([...playableMatch.matchSetCommands()], StartGame);
                    if (commands.length > 0)
                        playableMatch.commandInvoker.invoke(commands[0]); // start game
                });

                it('should have game in progress', () => {
                    expect(playableMatch.match.sets.last.games.last.inProgress).to.be.true;
                });

                describe('win-game', () => {
                    let commands;
                    beforeEach(() => {
                        commands = util.filterCommands([...playableMatch.setGameCommands()], WinGame);
                    });

                    it('should have win game command', () => {
                        expect(commands.length).to.be.equal(2);
                    });

                    it('should win game', () => {
                        playableMatch.commandInvoker.invoke(commands[0]); // win game
                        expect(playableMatch.match.sets.last.games.last.inProgress).not.to.be.ok;
                    });

                    describe('set-won', () => {
                        it('should have correct score', () => {
                            expect(playableMatch.match.sets.last.scores).to.be.eql([i, 0]);
                        });
                        if (i === 6) {
                            describe(`game-${i}`, () => {
                                it('should not be in progress', () => {
                                    expect(playableMatch.match.sets.last.inProgress).not.to.be.ok;
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

describe('second-set', () => {
    let playableMatch;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        util.startPlay(playableMatch);
        util.winSet(playableMatch, 1);
    });

    it('should have StartSet command', () => {
        const commands = util.filterCommands([...playableMatch.matchCommands()], StartSet);
        expect(util.filterCommands(commands, StartSet).length).to.be.equal(1)
    });

    describe('invoke-StartSet', () => {
        beforeEach(() => {
            const commands = util.filterCommands([...playableMatch.matchCommands()], StartSet);
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


describe('match-tiebreak', () => {
    let playableMatch;
    let commands;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        util.winSet(playableMatch, 1);
        util.winSet(playableMatch, 2);
        commands = util.filterCommands([...playableMatch.matchCommands()], StartMatchTiebreak);
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
                commands = util.filterCommands([...playableMatch.setGameCommands()], WinMatchTiebreak);
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


describe('set-tiebreak', () => {
    let playableMatch;
    let commands;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        util.winGames(playableMatch, 1, 5);
        util.winGames(playableMatch, 2, 6);
        util.winGames(playableMatch, 1, 1);
        commands = util.filterCommands([...playableMatch.matchSetCommands()], StartSetTiebreak);
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
                commands = util.filterCommands([...playableMatch.setGameCommands()], WinSetTiebreak);
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


describe('win-match', () => {
    let playableMatch;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
    });

    describe('in-2-sets', () => {
        beforeEach(() => {
            util.winSet(playableMatch, 1);
            util.winSet(playableMatch, 1);
        });
        it('should have won match', () => {
            expect(playableMatch.match.winnerId).to.be.equal(1);
        });
    });

    describe('in-3-sets', () => {
        beforeEach(() => {
            util.winSet(playableMatch, 1);
            util.winSet(playableMatch, 2);
            util.startMatchTiebreak(playableMatch);
            util.winMatchTiebreak(playableMatch, 2);
        });
        it('should have won match', () => {
            expect(playableMatch.match.winnerId).to.be.equal(2);
        });
    });

});


describe('start-over', () => {
    let playableMatch;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
        util.winSet(playableMatch, 1);
        util.winSet(playableMatch, 1);
    });

    it('should have StartOver command', () => {
        const commands = util.filterCommands([...playableMatch.otherCommands()], StartOver);
        expect(util.filterCommands(commands, StartOver).length).to.be.equal(1)
    });

    describe('invoke', () => {
        beforeEach(() => {
            const commands = util.filterCommands([...playableMatch.otherCommands()], StartOver);
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

describe('undo', () => {
    let playableMatch;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
    });

    describe('start-warmup', ()=>{
        let commands;
        beforeEach(()=>{
            util.startWarmup(playableMatch);
            commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });
        it('should have command title', ()=> {
            expect(commands[0].title).to.be.string;
        });
        describe('when-undo', ()=> {
            beforeEach(() => {
                playableMatch.commandInvoker.invoke(commands[0]);
            });

            it('should undo', () => {
                expect(playableMatch.match.warmingUp).not.to.be.true;
            });

            it('should have start warmup command', () => {
                let commands = util.filterCommands([...playableMatch.matchCommands()], StartWarmup);
                expect(commands.length).to.be.equal(1);
            });
        });

    });

    describe('start-play', ()=>{
        let commands;
        beforeEach(()=>{
            util.startPlay(playableMatch);
            commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });
        it('should have command title', ()=> {
            expect(commands[0].title).to.be.string;
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
            it('should have start play command', ()=>{
                let commands = util.filterCommands([...playableMatch.matchCommands()], StartPlay);
                expect(commands.length).to.be.equal(2);
            });
        });

    });

    describe('start-game', ()=>{
        let commands;
        let matchSet;
        let gameCount;
        beforeEach(()=>{
            util.winGames(playableMatch, 1, 1);
            util.tryStartGame(playableMatch);
            matchSet = playableMatch.match.sets.last;
            gameCount = matchSet.games.count;
            commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });
        it('should have command title', ()=> {
            expect(commands[0].title).to.be.string;
        });
        describe('when-undo', ()=> {
            beforeEach(()=>{
                playableMatch.commandInvoker.invoke(commands[0]);
            });

            it('should 1 less game', ()=>{
                expect(matchSet.games.count).to.be.equal(gameCount-1);
            });

            it('should have start game command', ()=>{
                let commands = util.filterCommands([...playableMatch.matchSetCommands()], StartGame);
                expect(commands.length).to.be.equal(1);
            });
        });
    });

    describe('start-set-tiebreaker', ()=>{
        let commands;
        let matchSet;
        let gameCount;
        beforeEach(()=>{
            util.winGames(playableMatch, 1, 5);
            util.winGames(playableMatch, 2, 6);
            util.winGames(playableMatch, 1, 1);
            util.startSetTiebreak(playableMatch);
            matchSet = playableMatch.match.sets.last;
            gameCount = matchSet.games.count;
            commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });
        it('should have command title', ()=> {
            expect(commands[0].title).to.be.string;
        });
        describe('when-undo', ()=> {
            beforeEach(()=>{
                playableMatch.commandInvoker.invoke(commands[0]);
            });

            it('should 1 less game', ()=>{
                expect(matchSet.games.count).to.be.equal(gameCount-1);
            });

            it('should have start tiebreak command', ()=>{
                let commands = util.filterCommands([...playableMatch.matchSetCommands()], StartSetTiebreak);
                expect(commands.length).to.be.equal(1);
            });
        });
    });

    describe('win-game', ()=>{
        let commands;
        let game;
        let scores;
        let matchSet;
        beforeEach(()=>{
            util.winGames(playableMatch, 1, 1);
            matchSet = playableMatch.match.sets.last;
            scores = matchSet.scores;
            game = matchSet.games.last;
            commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });
        it('should have command title', ()=> {
            expect(commands[0].title).to.be.string;
        });
        describe('when-undo', ()=> {
            beforeEach(()=>{
                playableMatch.commandInvoker.invoke(commands[0]);
            });
            it('should not have winnerId', ()=>{
                expect(game.winnerId).not.to.exist;
            });

            it('should change set score', ()=>{
                expect(matchSet.scores).to.eql([scores[0]-1, scores[1]]);
            });

            it('should have win game command', ()=>{
                let commands = util.filterCommands([...playableMatch.setGameCommands()], WinGame);
                expect(commands.length).to.be.equal(2);
            });

        });
    });

    describe('win-set-tiebreak', ()=>{
        let setScores;
        let matchScores;
        let matchSet;
        let commands;
        beforeEach(()=>{
            util.winGames(playableMatch, 1, 5);
            util.winGames(playableMatch, 2, 6);
            util.winGames(playableMatch, 1, 1);
            util.startSetTiebreak(playableMatch);
            util.winSetTiebreak(playableMatch, 1);
            matchSet = playableMatch.match.sets.last;
            setScores = matchSet.scores;
            matchScores = playableMatch.match.scores;
            commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });
        it('should have command title', ()=> {
            expect(commands[0].title).to.be.string;
        });
        describe('when-undo', ()=> {
            beforeEach(()=>{
                playableMatch.commandInvoker.invoke(commands[0]);
            });
            it('should not have winnerId', ()=>{
                expect(matchSet.winnerId).not.to.exist;
            });

            it('should change set score', ()=>{
                expect(matchSet.scores).to.eql([setScores[0]-1, setScores[1]]);
            });

            it('should change match score', ()=>{
                expect(playableMatch.match.scores).to.eql([matchScores[0]-1, matchScores[1]]);
            });

            it('should have win tiebreak command', ()=>{
                let commands = util.filterCommands([...playableMatch.setGameCommands()], WinSetTiebreak);
                expect(commands.length).to.be.equal(2);
            });

        });
    });

    describe('start-set', ()=> {
        let setCount;
        let commands;
        beforeEach(()=> {
            util.winSet(playableMatch, 1);
            util.tryStartSet(playableMatch);
            setCount = playableMatch.match.sets.count;
            commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });
        it('should have command title', ()=> {
            expect(commands[0].title).to.be.string;
        });
        describe('when-undo', ()=> {
            beforeEach(() => {
                playableMatch.commandInvoker.invoke(commands[0]);
            });

            it('should have one less set', () => {
                expect(playableMatch.match.sets.count).to.equal(setCount-1);
            });
            it('should have start set command', ()=>{
                let commands = util.filterCommands([...playableMatch.matchCommands()], StartSet);
                expect(commands.length).to.be.equal(1);
            });
        });

    });

    describe('start-match-tiebreak', ()=> {
        let setCount;
        let commands;
        beforeEach(()=> {
            util.winSet(playableMatch, 1);
            util.winSet(playableMatch, 2);
            util.startMatchTiebreak(playableMatch);
            setCount = playableMatch.match.sets.count;
            commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });
        it('should have command title', ()=> {
            expect(commands[0].title).to.be.string;
        });
        describe('when-undo', ()=> {
            beforeEach(() => {
                playableMatch.commandInvoker.invoke(commands[0]);
            });

            it('should have one less set', () => {
                expect(playableMatch.match.sets.count).to.equal(setCount-1);
            });
            it('should have start match tiebreak command', ()=>{
                let commands = util.filterCommands([...playableMatch.matchCommands()], StartMatchTiebreak);
                expect(commands.length).to.be.equal(1);
            });
        });

    });

    describe('win-set', ()=> {
        let commands;
        let matchScores;
        let setScores;
        let matchSet;
        beforeEach(()=> {
            util.winSet(playableMatch, 1);

            matchScores = playableMatch.match.scores;
            matchSet = playableMatch.match.sets.last;
            setScores = matchSet.scores;
            commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });
        it('should have command title', ()=> {
            expect(commands[0].title).to.be.string;
        });
        describe('when-undo', ()=> {
            beforeEach(() => {
                playableMatch.commandInvoker.invoke(commands[0]);
            });

            it('should win one less set', () => {
                expect(playableMatch.match.scores).to.eql([matchScores[0]-1, matchScores[1]]);
            });

            it('should win one less game', () => {
                expect(matchSet.scores).to.eql([setScores[0]-1, setScores[1]]);
            });

            it('should not have winner', () => {
                expect(matchSet.winnerId).not.to.exist;
            });
        });

    });

    describe('win-match', ()=> {
        let commands;
        let matchScores;
        let winnerId;
        beforeEach(()=> {
            util.winSet(playableMatch, 1);
            util.winSet(playableMatch, 1);
            winnerId = playableMatch.match.winnerId;

            matchScores = playableMatch.match.scores;
            commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });

        it('should have command title', ()=> {
            expect(commands[0].title).to.be.string;
        });

        describe('when-undo', ()=> {
            beforeEach(() => {
                playableMatch.commandInvoker.invoke(commands[0]);
            });

            it('should win one less set', () => {
                expect(playableMatch.match.scores).to.eql([matchScores[0]-1, matchScores[1]]);
            });

            it('should not have winner', () => {
                expect(playableMatch.match.winnerId).not.to.equal(winnerId);
            });

            it('should not have winner', () => {
                expect(playableMatch.match.winnerId).not.to.exist;
            });

            it('should have win game command', ()=>{
                let commands = util.filterCommands([...playableMatch.setGameCommands()], WinGame);
                expect(commands.length).to.be.equal(2);
            });

        });

    });

    describe('win-match-tiebreak', ()=> {
        let commands;
        let matchScores;
        let winnerId;
        beforeEach(()=> {
            util.winSet(playableMatch, 1);
            util.winSet(playableMatch, 2);
            util.startMatchTiebreak(playableMatch);
            util.winMatchTiebreak(playableMatch, 1);
            winnerId = playableMatch.match.winnerId;

            matchScores = playableMatch.match.scores;
            commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
        });

        it('should have undo command', ()=> {
            expect(commands.length).to.be.equal(1);
        });

        it('should have command title', ()=> {
            expect(commands[0].title).to.be.string;
        });

        describe('when-undo', ()=> {
            beforeEach(() => {
                playableMatch.commandInvoker.invoke(commands[0]);
            });

            it('should win one less set', () => {
                expect(playableMatch.match.scores).to.eql([matchScores[0]-1, matchScores[1]]);
            });

            it('should not have winner', () => {
                expect(playableMatch.match.winnerId).not.to.equal(winnerId);
            });

            it('should not have winner', () => {
                expect(playableMatch.match.winnerId).not.to.exist;
            });

            it('should have win match tiebreak command', ()=>{
                let commands = util.filterCommands([...playableMatch.setGameCommands()], WinMatchTiebreak);
                expect(commands.length).to.be.equal(2);
            });

        });
    });
});

describe('all-commands', ()=>{
    let playableMatch;
    beforeEach(() => {
        playableMatch = matchFactory.makeMatch();
    });

    describe('new-match', ()=>{
        it ('should have commands', () => {
            expect(util.hasCommands(playableMatch, [StartPlay, StartPlay, StartWarmup])).to.be.true;
        });

        describe('start-match', () => {
            beforeEach(() => {
                util.startPlay(playableMatch);
            });

            it('should have commands', () => {
                expect(util.hasCommands(playableMatch, [WinGame, WinGame, StartOver, UndoOperation])).to.be.true;
            });

            describe('win-game', () => {
                beforeEach(() => {
                    util.winGame(playableMatch, 1);
                });

                it('should have commands', () => {
                    expect(util.hasCommands(playableMatch, [StartGame, StartOver, UndoOperation])).to.be.true;
                });

            })
        })

    });

    describe('win-set', ()=> {
        beforeEach(() => {
            util.winSet(playableMatch, 1);
        });
        it('should have commands', () => {
            expect(util.hasCommands(playableMatch, [StartSet, StartOver, UndoOperation])).to.be.true;
        });

        describe('start-set', ()=> {
            beforeEach(() => {
                util.tryStartSet(playableMatch);
            });
            it('should have commands', () => {
                expect(util.hasCommands(playableMatch, [WinGame, WinGame, StartOver, UndoOperation])).to.be.true;
            });
        });
    });

    describe('win-match', ()=> {
        beforeEach(() => {
            util.winSet(playableMatch, 1);
            util.winSet(playableMatch, 1);
        });
        it('should have commands', () => {
            expect(util.hasCommands(playableMatch, [StartOver, UndoOperation])).to.be.true;
        });
    });

    describe('start-match-tiebreak', ()=> {
        beforeEach(() => {
            util.winSet(playableMatch, 1);
            util.winSet(playableMatch, 2);
        });
        it('should have commands', () => {
            expect(util.hasCommands(playableMatch, [StartMatchTiebreak, StartOver, UndoOperation])).to.be.true;
        });

        describe('win-match-tiebreak', ()=> {
            beforeEach(()=>{
                util.startMatchTiebreak(playableMatch);
            });
            it('should have commands', () => {
                expect(util.hasCommands(playableMatch, [WinMatchTiebreak, WinMatchTiebreak, StartOver, UndoOperation])).to.be.true;
            });


        })
    });

    describe('start-set-tiebreak', ()=> {
        beforeEach(() => {
            util.winGames(playableMatch, 1, 5);
            util.winGames(playableMatch, 2, 6);
            util.winGames(playableMatch, 1, 1);
        });
        it('should have commands', () => {
            expect(util.hasCommands(playableMatch, [StartSetTiebreak, StartOver, UndoOperation])).to.be.true;
        });
        describe('win-set-tiebreak', ()=> {
            beforeEach(()=>{
                util.startSetTiebreak(playableMatch);
            });
            it('should have commands', () => {
                expect(util.hasCommands(playableMatch, [WinSetTiebreak, WinSetTiebreak, StartOver, UndoOperation])).to.be.true;
            });
        })
    });
});



