import {expect} from 'chai';
import {playableMatchFactory} from '../../src/match/playable-factory';
import {
    StartWarmup, StartPlay, StartOver, StartSet, StartMatchTiebreak,
    StartGame, StartSetTiebreak, WinMatchTiebreak,
    WinGame, WinSetTiebreak, UndoOperation
} from '../../src/match/command';
import {PlayerNameService, OpponentNameService} from '../../src/match/name-service'
import {createFromFactory} from '../../src/match/di-util'
import {Utils as util} from './command-util';
import {CommandDecorator, decorateCommand} from '../../src/match/command-decorator'
import {CommandTitleDecorator} from '../../src/match/command-title-decorator'


describe('command-title-decorator', () => {

    describe('unknown class', () => {

        let playableMatch;

        class Invalid {

        }

        beforeEach(() => {
            playableMatch = util.makeMatch(util.singlesOptions, (container) => {
                container.registerInstance(CommandDecorator, createFromFactory(container, CommandTitleDecorator));
            });
        });

        it('should throw error', () => {
            expect(()=>decorateCommand(playableMatch.container, new Invalid())).to.throw(Error);
        });
    });
    const creators = [
        {
            title: 'without-name-service',
            fn: () => {
                const result = util.makeMatch(util.singlesOptions, (container) => {
                    // Register decorator
                    container.registerInstance(CommandDecorator, createFromFactory(container, CommandTitleDecorator));
                });
                return result;
            }
        },
        {
            title: 'with-name-service',
            fn: () => {
                const result = util.makeMatch(util.singlesOptions, (container) => {
                    // Register decorator
                    container.registerInstance(CommandDecorator, createFromFactory(container, CommandTitleDecorator));
                    container.registerInstance(PlayerNameService, createFromFactory(container, PlayerNameService));
                    container.registerInstance(OpponentNameService, createFromFactory(container, OpponentNameService));
                });
                return result;
            }
        }

    ];

    creators.forEach((creator) => {

        describe(creator.title, () => {
            let playableMatch;
            beforeEach(() => {
                playableMatch = creator.fn();
            });

            function expectCommandTitles() {
                for (const command of playableMatch.allCommands()) {
                    expect(command.title).to.exist;
                }
            }

            describe('new-match', () => {
                it('should have commands', () => {
                    expect(util.hasCommands(playableMatch, [StartPlay, StartPlay, StartWarmup])).to.be.true;
                });

                describe('start-match', () => {
                    beforeEach(() => {
                        util.startPlay(playableMatch);
                    });

                    it('should have commands', () => {
                        expect(util.hasCommands(playableMatch, [WinGame, WinGame, StartOver, UndoOperation])).to.be.true;
                    });

                    it('should have title', () => {
                        expectCommandTitles();
                    });

                    describe('win-game', () => {
                        beforeEach(() => {
                            util.winGame(playableMatch, 1);
                        });

                        it('should have commands', () => {
                            expect(util.hasCommands(playableMatch, [StartGame, StartOver, UndoOperation])).to.be.true;
                        });

                        it('should have title', () => {
                            expectCommandTitles();
                        });
                    })
                })
            });

            describe('win-set', () => {
                beforeEach(() => {
                    util.winSet(playableMatch, 1);
                });
                it('should have commands', () => {
                    expect(util.hasCommands(playableMatch, [StartSet, StartOver, UndoOperation])).to.be.true;
                });

                it('should have title', () => {
                    expectCommandTitles();
                });

                describe('start-set', () => {
                    beforeEach(() => {
                        util.tryStartSet(playableMatch);
                    });
                    it('should have commands', () => {
                        expect(util.hasCommands(playableMatch, [WinGame, WinGame, StartOver, UndoOperation])).to.be.true;
                    });
                    it('should have title', () => {
                        expectCommandTitles();
                    });
                });
            });

            describe('win-match', () => {
                beforeEach(() => {
                    util.winMatch(playableMatch, 1);
                });
                it('should have commands', () => {
                    expect(util.hasCommands(playableMatch, [StartOver, UndoOperation])).to.be.true;
                });
                it('should have title', () => {
                    expectCommandTitles();
                });
            });

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

            describe('start-set-tiebreak', () => {
                beforeEach(() => {
                    util.tieSet(playableMatch);
                });
                it('should have commands', () => {
                    expect(util.hasCommands(playableMatch, [StartSetTiebreak, StartOver, UndoOperation])).to.be.true;
                });
                it('should have title', () => {
                    expectCommandTitles();
                });
                describe('win-set-tiebreak', () => {
                    beforeEach(() => {
                        util.startSetTiebreak(playableMatch);
                    });
                    it('should have commands', () => {
                        expect(util.hasCommands(playableMatch, [WinSetTiebreak, WinSetTiebreak, StartOver, UndoOperation])).to.be.true;
                    });
                    it('should have title', () => {
                        expectCommandTitles();
                    });
                })
            });
        });
    });
});