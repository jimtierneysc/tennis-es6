import {expect} from 'chai';
import {playableMatchFactory} from '../../src/match/playable-factory';
import {StartPlay} from '../../src/match/command';
import {createFromFactory} from '../../src/match/di-util'
import {Utils as util} from './command-util';
import {MatchHistory} from '../../src/match/history'
import {MatchHistoryList} from '../../src/match/history-list'


describe('history', () => {

    const creators = [
        {
            title: 'without-service',
            hasHistory: false,
            fn: () => {
                return util.makeMatch(util.singlesOptions);
            }
        },
        {
            title: 'with-service',
            hasHistory: true,
            fn: () => {
                const result = util.makeMatch(util.singlesOptions, (container) => {
                    // Register decorator
                    container.registerInstance(MatchHistory, createFromFactory(container, MatchHistoryList));
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
                let commands = util.filterCommands([...playableMatch.matchCommands()], StartPlay);
                playableMatch.commandInvoker.invoke(commands[0]);
            });

            if (creator.hasHistory) {
                it('should have history services', () => {
                    expect(playableMatch.history).to.exist;
                });
                it('should have history count', () => {
                    expect(playableMatch.history.list.count).to.equal(1);
                });
                it('should have history item title', () => {
                    expect(playableMatch.history.list.last.title).not.to.be.empty;
                });
            }

            if (!creator.hasHistory) {
                it('should have history services', () => {
                    expect(playableMatch.history).not.to.exist;
                });
            }
        });

    });
});
