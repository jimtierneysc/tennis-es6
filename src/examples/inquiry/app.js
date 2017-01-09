'use strict';
import inquirer from 'inquirer';
import {matchFactory} from '../../match/match-factory';
import {matchObservable} from '../../match/match-observable';
import {Match} from '../../match/match-entity';

class PlayMatch {

    constructor(match) {
        this.match = match;
        this.onScores = (entity) => {
            console.log(`${entity.constructor.name}, index: ${entity.index}, score: ${JSON.stringify(entity.scores)}`)
        };
        this.onWinner = (entity) => {
            console.log(`${entity.constructor.name}, index: ${entity.index}, score: ${JSON.stringify(entity.scores)}`)
        };
        matchObservable.subscribeScores(this.onScores);
        matchObservable.subscribeWinner(this.onWinner);
        this.map = new Map();
        this.showMainMenu = true;
        this.done = false;
        this.questions = {
            type: 'list',
            name: 'command',
            message: 'What do you want to do?',
            choices: ['a', 'b']
        };
    }

    dispose() {
        matchObservable.unSubscribeScores(this.onScores);
        matchObservable.unSubscribeWinner(this.onWinner);
    }

    showHistory() {
        for (const item of this.match.historyList) {
            console.log(item.title);
        }
    }

    updateQuestions() {
        this.questions.choices = [];
        this.map.clear();
        if (this.showMainMenu) {
            this.map.set('play', () => this.showMainMenu = false);
            this.map.set('history', () => this.showHistory());
            this.map.set('quit', () => this.done = true);
        } else {
            let commands = Array.prototype.concat(
                [...this.match.setGameCommands()],
                [...this.match.matchSetCommands()],
                [...this.match.matchCommands()],
                [...this.match.otherCommands()]);
            for (let c of commands) {
                this.map.set(c.title, () => this.match.commandInvoker.invoke(c));
            }
            this.map.set('menu', () => this.showMainMenu = true);
        }

        [...this.map.keys()].forEach((value) => this.questions.choices.push(value));

    }

    startPlay() {
        this.done = false;
        this.showMainMenu = true;
        const promise = new Promise((resolve, reject) => {
            this._play(() => {
                resolve('done');
            });
        });
        return promise;
    }

    _play(done) {
        this.updateQuestions();
        inquirer.prompt(this.questions).then((answers) => {
            // console.log(answers);
            let fn = this.map.get(answers.command);
            fn();
            if (!this.done) {
                this._play(done);
            } else {
                done();
            }
        });
    }
}

let match = matchFactory.makeMatch();
let playMatch = new PlayMatch(match);
playMatch.startPlay().then((value) => {
    console.log(value);
    playMatch.dispose();
});
