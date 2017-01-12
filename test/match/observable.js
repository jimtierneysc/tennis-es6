/**
 * Test tennis match classes
 */

import {expect} from 'chai';
import {MatchObservable} from '../../src/match/observable';


const matchObservable = new MatchObservable();

describe('matchObservable', () => {

    const testCases = [
        {
            title: 'observable-scores',
            subscribe: matchObservable.subscribeScores,
            unSubscribe: matchObservable.unSubscribeScores,
            change: matchObservable.changeScores
        },
        {
            title: 'observable-winner',
            subscribe: matchObservable.subscribeWinner,
            unSubscribe: matchObservable.unSubscribeWinner,
            change: matchObservable.changeWinner
        }
     ];


    testCases.forEach((testCase)=>
    {
        describe(`${testCase.title}-exists`, () => {
            it('should have subscribe', () => {
                expect(testCase.subscribe).to.exist;
            });

            it('should have unsubscribe', () => {
                expect(testCase.unSubscribe).to.exist;
            });

            it('should have change', () => {
                expect(testCase.change).to.exist;
            });
        });
        describe(`${testCase.title}-operates`, () => {

            let changed;
            let changedEntity;

            function onChange(entity) {
                changedEntity = entity;
                changed = true;
            }

            function change(entity) {
                changed = false;
                changedEntity = null;
                testCase.change.apply(matchObservable, [entity]);
            }

            beforeEach(() => {
                testCase.subscribe.apply(matchObservable, [onChange])

            });

            afterEach(() => {
                testCase.unSubscribe.apply(matchObservable, [onChange])

            });

            describe('emits', () => {
                let test = new Object();
                beforeEach(() => {
                    change(test);
                });
                it('should emit', () => {
                    expect(changed).to.be.true;
                });

                it('should pass entity', () => {
                    expect(changedEntity).to.equal(test);
                });

            });

            describe('unsubscribes', () => {
                beforeEach(() => {
                    testCase.unSubscribe.apply(matchObservable, [onChange]);
                    change(new Object());
                });

                it('should not emit', () => {
                    expect(changed).not.to.be.true;
                });

            });


        });

    });
});





