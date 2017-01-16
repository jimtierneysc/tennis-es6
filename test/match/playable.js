/**
 * Test tennis match classes
 */

import {expect} from 'chai';
import {Utils as util} from './command-util';


const testParams = util.testParams;


describe('playable', () => {

    let playableMatch;

    beforeEach(() => {
        playableMatch = util.makeMatch();
    });

    describe('members', () => {

        it('should have match', ()=>{
            expect(playableMatch.match).to.exist;

        });

        it('should have command invoker', ()=>{
            expect(playableMatch.commandInvoker).to.exist;
        });

        it('should have match controller', ()=>{
            expect(playableMatch.matchController).to.exist;
        });

        it('should have set controller', ()=>{
            expect(playableMatch.matchSetController).to.exist;
        });

        it('should have game controller', ()=>{
            expect(playableMatch.setGameController).to.exist;
        });

        it('should have game controller', ()=>{
            expect(playableMatch.setGameController).to.exist;
        });

        it('should have serving strategy', ()=>{
            expect(playableMatch.servingStrategy).to.exist;
        });

        it('should not have history', ()=>{
            expect(playableMatch.history).not.to.exist;
        });

        it('should not have player name service', ()=>{
            expect(playableMatch.playerNameService).not.to.exist
        });

        it('should not have opponent name service', ()=>{
            expect(playableMatch.opponentNameService).not.to.exist;
        });

        it('should have other commands', ()=>{
            expect(playableMatch.otherCommands).to.exist;
        });

        it('should have all commands', ()=>{
            expect(playableMatch.allCommands).to.exist;
        });

        it('should have match commands', ()=>{
            expect(playableMatch.matchCommands).to.exist;
        });

        it('should have match commands', ()=>{
            expect(playableMatch.matchSetCommands).to.exist;
        });

        it('should have set commands', ()=>{
            expect(playableMatch.setGameCommands).to.exist;
        });

    })
});

