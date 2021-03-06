/**
 * Test tennis match classes
 */

import {expect} from 'chai';
import {playableMatchFactory} from '../../src/match/playable-factory';
import {
    StartWarmup, StartPlay, StartOver, StartSet, StartMatchTiebreak,
    StartGame, StartSetTiebreak, WinMatchTiebreak,
    WinGame, WinSetTiebreak, UndoOperation
} from '../../src/match/command';
import {Utils as util} from './command-util';
import {MatchOptions} from '../../src/match/options'


const testParams = util.testParams;


describe('startWarmup', () => {

    let command;
    let playableMatch;

    beforeEach(() => {
        playableMatch = util.makeMatch();
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

describe('startPlay', () => {

    testParams.forEach((params) => {
        describe(params.title, () => {
            let commands;
            let playableMatch;

            beforeEach(() => {
                playableMatch = util.makeMatch(params.options);
                commands = util.filterCommands([...playableMatch.matchCommands()], StartPlay);
            });

            it('should have commands', () => {
                expect(commands.length).to.equal(params.options.players.length);
            });
        });
    });
});

describe('winGame', () => {
    testParams.forEach((params) => {
        describe(params.title, () => {
            let commands;
            let playableMatch;

            beforeEach(() => {
                playableMatch = util.makeMatch(params.options);
                util.startPlay(playableMatch);
                commands = util.filterCommands([...playableMatch.setGameCommands()], WinGame);
            });

            it('should have commands', () => {
                expect(commands.length).to.equal(2);
            });

            it('should award win to opponent 1', () => {
                playableMatch.commandInvoker.invoke(commands[0]);  // win game
                expect(playableMatch.match.sets.last.games.last.winnerId).to.be.equal(1);
            });

            it('should award win to opponent 2', () => {
                playableMatch.commandInvoker.invoke(commands[1]);  // win game
                expect(playableMatch.match.sets.last.games.last.winnerId).to.be.equal(2);
            });
        });
    });

});

describe('startGame-first-set', () => {
    testParams.forEach((params) => {
        describe(params.title, () => {
            let commands;
            let playableMatch;

            beforeEach(() => {
                playableMatch = util.makeMatch(params.options);
                util.startPlay(playableMatch);
                util.winGame(playableMatch, 1);
                commands = util.filterCommands([...playableMatch.matchSetCommands()], StartGame);
            });

            it('should have commands', () => {
                expect(commands.length).to.equal(MatchOptions.doublesKind(params.options) ? 2 : 1);
            });

            describe('start-game-2', () => {
                beforeEach(() => {
                    playableMatch.commandInvoker.invoke(commands[0]); // start game
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
    });
});

describe('win-set', () => {

    testParams.forEach((params) => {
        describe(params.title, () => {
            let playableMatch;
            before(() => {
                playableMatch = util.makeMatch(params.options);
                util.startPlay(playableMatch);
            });

            for (let i = 1; i <= MatchOptions.winSetThreshold(params.options); i++) {
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
                                if (i === MatchOptions.winSetThreshold(params.options)) {
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
    });
});

describe('second-set', () => {
    testParams.filter((params) => MatchOptions.winMatchThreshold(params.options) > 1).forEach((params) => {
        describe(params.title, () => {
            let playableMatch;
            beforeEach(() => {
                playableMatch = util.makeMatch(params.options);
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
    });
});


describe('match-tiebreak', () => {
    testParams.filter((params) => MatchOptions.finalSetIsTiebreak(params.options)).forEach((params) => {
        describe(params.title, () => {
            let playableMatch;
            let commands;
            beforeEach(() => {
                playableMatch = util.makeMatch(params.options);
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
        })
    })
});


describe('set-tiebreak', () => {
    testParams.forEach((params) => {
        describe(params.title, () => {
            let playableMatch;
            let commands;
            beforeEach(() => {
                playableMatch = util.makeMatch(params.options);
                util.tieSet(playableMatch);
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
    });
});


describe('win-match', () => {
    testParams.forEach((params) => {
        describe(params.title, () => {
            let playableMatch;
            beforeEach(() => {
                playableMatch = util.makeMatch(params.options);
            });

            describe('in-straight-sets', () => {
                beforeEach(() => {
                    util.winMatch(playableMatch, 1);
                });
                it('should have won match', () => {
                    expect(playableMatch.match.winnerId).to.be.equal(1);
                });
            });

            if (MatchOptions.finalSetIsTiebreak(params.options)) {
                describe('in-tiebreaker', () => {
                    beforeEach(() => {
                        util.tieMatch(playableMatch);
                        util.startMatchTiebreak(playableMatch);
                        util.winMatchTiebreak(playableMatch, 2);
                    });
                    it('should have won match', () => {
                        expect(playableMatch.match.winnerId).to.be.equal(2);
                    });
                });
            }

        });


        describe('start-over', () => {
            let playableMatch;
            beforeEach(() => {
                playableMatch = util.makeMatch(params.options);
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
    });
});

describe('undo', () => {
    testParams.forEach((params) => {
        describe(params.title, () => {
            let playableMatch;
            beforeEach(() => {
                playableMatch = util.makeMatch(params.options);
            });

            describe('start-warmup', () => {
                let commands;
                beforeEach(() => {
                    util.startWarmup(playableMatch);
                    commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
                });

                it('should have undo command', () => {
                    expect(commands.length).to.be.equal(1);
                });
                describe('when-undo', () => {
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

            describe('start-play', () => {
                let commands;
                beforeEach(() => {
                    util.startPlay(playableMatch);
                    commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
                });

                it('should have undo command', () => {
                    expect(commands.length).to.be.equal(1);
                });
                describe('when-undo', () => {
                    beforeEach(() => {
                        playableMatch.commandInvoker.invoke(commands[0]);
                    });
                    it('should not be started', () => {
                        expect(playableMatch.match.started).not.to.be.true;
                    });

                    it('should have no sets', () => {
                        expect(playableMatch.match.sets.count).to.be.equal(0);
                    });
                    it('should have start play command', () => {
                        let commands = util.filterCommands([...playableMatch.matchCommands()], StartPlay);
                        expect(commands.length).to.be.equal(MatchOptions.playerCount(params.options));
                    });
                });

            });

            describe('start-game', () => {
                let commands;
                let matchSet;
                let gameCount;
                beforeEach(() => {
                    util.winGames(playableMatch, 1, 1);
                    util.tryStartGame(playableMatch);
                    matchSet = playableMatch.match.sets.last;
                    gameCount = matchSet.games.count;
                    commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
                });

                it('should have undo command', () => {
                    expect(commands.length).to.be.equal(1);
                });
                describe('when-undo', () => {
                    beforeEach(() => {
                        playableMatch.commandInvoker.invoke(commands[0]);
                    });

                    it('should 1 less game', () => {
                        expect(matchSet.games.count).to.be.equal(gameCount - 1);
                    });

                    it('should have start game command', () => {
                        let commands = util.filterCommands([...playableMatch.matchSetCommands()], StartGame);
                        expect(commands.length).to.be.equal(MatchOptions.playerCount(params.options) / 2);
                    });
                });
            });

            describe('start-set-tiebreaker', () => {
                let commands;
                let matchSet;
                let gameCount;
                beforeEach(() => {
                    util.tieSet(playableMatch);
                    util.startSetTiebreak(playableMatch);
                    matchSet = playableMatch.match.sets.last;
                    gameCount = matchSet.games.count;
                    commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
                });

                it('should have undo command', () => {
                    expect(commands.length).to.be.equal(1);
                });
                describe('when-undo', () => {
                    beforeEach(() => {
                        playableMatch.commandInvoker.invoke(commands[0]);
                    });

                    it('should 1 less game', () => {
                        expect(matchSet.games.count).to.be.equal(gameCount - 1);
                    });

                    it('should have start tiebreak command', () => {
                        let commands = util.filterCommands([...playableMatch.matchSetCommands()], StartSetTiebreak);
                        expect(commands.length).to.be.equal(1);
                    });
                });
            });

            describe('win-game', () => {
                let commands;
                let game;
                let scores;
                let matchSet;
                beforeEach(() => {
                    util.winGames(playableMatch, 1, 1);
                    matchSet = playableMatch.match.sets.last;
                    scores = matchSet.scores;
                    game = matchSet.games.last;
                    commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
                });

                it('should have undo command', () => {
                    expect(commands.length).to.be.equal(1);
                });
                describe('when-undo', () => {
                    beforeEach(() => {
                        playableMatch.commandInvoker.invoke(commands[0]);
                    });
                    it('should not have winnerId', () => {
                        expect(game.winnerId).not.to.exist;
                    });

                    it('should change set score', () => {
                        expect(matchSet.scores).to.eql([scores[0] - 1, scores[1]]);
                    });

                    it('should have win game command', () => {
                        let commands = util.filterCommands([...playableMatch.setGameCommands()], WinGame);
                        expect(commands.length).to.be.equal(2);
                    });

                });
            });

            describe('win-set-tiebreak', () => {
                let setScores;
                let matchScores;
                let matchSet;
                let commands;
                beforeEach(() => {
                    util.tieSet(playableMatch);
                    util.startSetTiebreak(playableMatch);
                    util.winSetTiebreak(playableMatch, 1);
                    matchSet = playableMatch.match.sets.last;
                    setScores = matchSet.scores;
                    matchScores = playableMatch.match.scores;
                    commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
                });

                it('should have undo command', () => {
                    expect(commands.length).to.be.equal(1);
                });
                describe('when-undo', () => {
                    beforeEach(() => {
                        playableMatch.commandInvoker.invoke(commands[0]);
                    });
                    it('should not have winnerId', () => {
                        expect(matchSet.winnerId).not.to.exist;
                    });

                    it('should change set score', () => {
                        expect(matchSet.scores).to.eql([setScores[0] - 1, setScores[1]]);
                    });

                    it('should change match score', () => {
                        expect(playableMatch.match.scores).to.eql([matchScores[0] - 1, matchScores[1]]);
                    });

                    it('should have win tiebreak command', () => {
                        let commands = util.filterCommands([...playableMatch.setGameCommands()], WinSetTiebreak);
                        expect(commands.length).to.be.equal(2);
                    });

                });
            });

            if (MatchOptions.winMatchThreshold(params.options) > 1) {
                describe('start-set', () => {
                    let setCount;
                    let commands;
                    beforeEach(() => {
                        util.winSet(playableMatch, 1);
                        util.tryStartSet(playableMatch);
                        setCount = playableMatch.match.sets.count;
                        commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
                    });

                    it('should have undo command', () => {
                        expect(commands.length).to.be.equal(1);
                    });
                    describe('when-undo', () => {
                        beforeEach(() => {
                            playableMatch.commandInvoker.invoke(commands[0]);
                        });

                        it('should have one less set', () => {
                            expect(playableMatch.match.sets.count).to.equal(setCount - 1);
                        });
                        it('should have start set command', () => {
                            let commands = util.filterCommands([...playableMatch.matchCommands()], StartSet);
                            expect(commands.length).to.be.equal(1);
                        });
                    });

                });
            }

            if (MatchOptions.finalSetIsTiebreak(params.options)) {
                describe('start-match-tiebreak', () => {
                    let setCount;
                    let commands;
                    beforeEach(() => {
                        util.winSet(playableMatch, 1);
                        util.winSet(playableMatch, 2);
                        util.startMatchTiebreak(playableMatch);
                        setCount = playableMatch.match.sets.count;
                        commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
                    });

                    it('should have undo command', () => {
                        expect(commands.length).to.be.equal(1);
                    });
                    describe('when-undo', () => {
                        beforeEach(() => {
                            playableMatch.commandInvoker.invoke(commands[0]);
                        });

                        it('should have one less set', () => {
                            expect(playableMatch.match.sets.count).to.equal(setCount - 1);
                        });
                        it('should have start match tiebreak command', () => {
                            let commands = util.filterCommands([...playableMatch.matchCommands()], StartMatchTiebreak);
                            expect(commands.length).to.be.equal(1);
                        });
                    });

                });
            }
            ;

            describe('win-set', () => {
                let commands;
                let matchScores;
                let setScores;
                let matchSet;
                beforeEach(() => {
                    util.winSet(playableMatch, 1);

                    matchScores = playableMatch.match.scores;
                    matchSet = playableMatch.match.sets.last;
                    setScores = matchSet.scores;
                    commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
                });

                it('should have undo command', () => {
                    expect(commands.length).to.be.equal(1);
                });
                describe('when-undo', () => {
                    beforeEach(() => {
                        playableMatch.commandInvoker.invoke(commands[0]);
                    });

                    it('should win one less set', () => {
                        expect(playableMatch.match.scores).to.eql([matchScores[0] - 1, matchScores[1]]);
                    });

                    it('should win one less game', () => {
                        expect(matchSet.scores).to.eql([setScores[0] - 1, setScores[1]]);
                    });

                    it('should not have winner', () => {
                        expect(matchSet.winnerId).not.to.exist;
                    });
                });

            });

            describe('win-match', () => {
                let commands;
                let matchScores;
                let winnerId;
                beforeEach(() => {
                    util.winMatch(playableMatch, 1);
                    winnerId = playableMatch.match.winnerId;

                    matchScores = playableMatch.match.scores;
                    commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
                });

                it('should have undo command', () => {
                    expect(commands.length).to.be.equal(1);
                });

                describe('when-undo', () => {
                    beforeEach(() => {
                        playableMatch.commandInvoker.invoke(commands[0]);
                    });

                    it('should win one less set', () => {
                        expect(playableMatch.match.scores).to.eql([matchScores[0] - 1, matchScores[1]]);
                    });

                    it('should not have winner', () => {
                        expect(playableMatch.match.winnerId).not.to.equal(winnerId);
                    });

                    it('should not have winner', () => {
                        expect(playableMatch.match.winnerId).not.to.exist;
                    });

                    it('should have win game command', () => {
                        let commands = util.filterCommands([...playableMatch.setGameCommands()], WinGame);
                        expect(commands.length).to.be.equal(2);
                    });

                });

            });

            if (MatchOptions.finalSetIsTiebreak(params.options)) {
                describe('win-match-tiebreak', () => {
                    let commands;
                    let matchScores;
                    let winnerId;
                    beforeEach(() => {
                        util.tieMatch(playableMatch);
                        util.startMatchTiebreak(playableMatch);
                        util.winMatchTiebreak(playableMatch, 1);
                        winnerId = playableMatch.match.winnerId;

                        matchScores = playableMatch.match.scores;
                        commands = util.filterCommands([...playableMatch.otherCommands()], UndoOperation);
                    });

                    it('should have undo command', () => {
                        expect(commands.length).to.be.equal(1);
                    });

                    describe('when-undo', () => {
                        beforeEach(() => {
                            playableMatch.commandInvoker.invoke(commands[0]);
                        });

                        it('should win one less set', () => {
                            expect(playableMatch.match.scores).to.eql([matchScores[0] - 1, matchScores[1]]);
                        });

                        it('should not have winner', () => {
                            expect(playableMatch.match.winnerId).not.to.equal(winnerId);
                        });

                        it('should not have winner', () => {
                            expect(playableMatch.match.winnerId).not.to.exist;
                        });

                        it('should have win match tiebreak command', () => {
                            let commands = util.filterCommands([...playableMatch.setGameCommands()], WinMatchTiebreak);
                            expect(commands.length).to.be.equal(2);
                        });

                    });
                });
            }
        });

        describe('all-commands', () => {
            let playableMatch;
            beforeEach(() => {
                playableMatch = util.makeMatch(params.options);
            });

            describe('new-match', () => {
                it('should have commands', () => {
                    if (MatchOptions.doublesKind(params.options))
                        expect(util.hasCommands(playableMatch, [StartPlay, StartPlay, StartPlay, StartPlay, StartWarmup])).to.be.true;
                    else
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
                            if (MatchOptions.doublesKind(params.options))
                                expect(util.hasCommands(playableMatch, [StartGame, StartGame, StartOver, UndoOperation])).to.be.true;
                            else
                                expect(util.hasCommands(playableMatch, [StartGame, StartOver, UndoOperation])).to.be.true;
                        });

                    })
                })

            });

            if (MatchOptions.winMatchThreshold(params.options) > 1) {
                describe('win-set', () => {
                    beforeEach(() => {
                        util.winSet(playableMatch, 1);
                    });
                    it('should have commands', () => {
                        expect(util.hasCommands(playableMatch, [StartSet, StartOver, UndoOperation])).to.be.true;
                    });


                    describe('start-set', () => {
                        beforeEach(() => {
                            util.tryStartSet(playableMatch);
                        });
                        it('should have commands', () => {
                            expect(util.hasCommands(playableMatch, [WinGame, WinGame, StartOver, UndoOperation])).to.be.true;
                        });
                    });
                });
            }

            describe('win-match', () => {
                beforeEach(() => {
                    util.winMatch(playableMatch, 1);
                });
                it('should have commands', () => {
                    expect(util.hasCommands(playableMatch, [StartOver, UndoOperation])).to.be.true;
                });
            });

            if (MatchOptions.finalSetIsTiebreak(params.options)) {
                describe('start-match-tiebreak', () => {
                    beforeEach(() => {
                        util.tieMatch(playableMatch);
                    });
                    it('should have commands', () => {
                        expect(util.hasCommands(playableMatch, [StartMatchTiebreak, StartOver, UndoOperation])).to.be.true;
                    });

                    describe('win-match-tiebreak', () => {
                        beforeEach(() => {
                            util.startMatchTiebreak(playableMatch);
                        });
                        it('should have commands', () => {
                            expect(util.hasCommands(playableMatch, [WinMatchTiebreak, WinMatchTiebreak, StartOver, UndoOperation])).to.be.true;
                        });


                    })
                });
            }

            describe('start-set-tiebreak', () => {
                beforeEach(() => {
                    util.tieSet(playableMatch);
                });
                it('should have commands', () => {
                    expect(util.hasCommands(playableMatch, [StartSetTiebreak, StartOver, UndoOperation])).to.be.true;
                });
                describe('win-set-tiebreak', () => {
                    beforeEach(() => {
                        util.startSetTiebreak(playableMatch);
                    });
                    it('should have commands', () => {
                        expect(util.hasCommands(playableMatch, [WinSetTiebreak, WinSetTiebreak, StartOver, UndoOperation])).to.be.true;
                    });
                })
            });
        });
    });
});



