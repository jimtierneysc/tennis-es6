'use strict';
import inquirer from 'inquirer';
import {playableMatchFactory} from '../../match/match-playable-factory';
import {Match} from '../../match/match-entity';

class MatchPlay {

    constructor(playable) {
        this.playable = playable;
        this.observable = playable.match.observable;
        this.onScores = (entity) => {
            console.log(`${entity.constructor.name}, index: ${entity.index}, score: ${JSON.stringify(entity.scores)}`)
        };
        this.onWinner = (entity) => {
            console.log(`${entity.constructor.name}, index: ${entity.index}, winner: ${entity.winnerId}`)
        };
        this.observable.subscribeScores(this.onScores);
        this.observable.subscribeWinner(this.onWinner);
        this.map = new Map();
        this.showMainMenu = true;
        this.done = false;
        this.questions = {
            type: 'rawlist',
            name: 'command',
            message: 'What do you want to do?',
            choices: []
        };
    }

    dispose() {
        this.observable.unSubscribeScores(this.onScores);
        this.observable.unSubscribeWinner(this.onWinner);
    }

    showHistory() {
        for (const item of this.playable.historyList) {
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
            for (let c of this.playable.allCommands()) {
                this.map.set(c.title, () => this.playable.commandInvoker.invoke(c));
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

let playable = playableMatchFactory.makeMatch();
let matchPlay = new MatchPlay(playable);
matchPlay.startPlay().then((value) => {
    console.log(value);
    matchPlay.dispose();
});
