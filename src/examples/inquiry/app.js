'use strict';
import inquirer from 'inquirer';
import {matchFactory} from '../../match/match-factory';
import {matchObservable} from '../../match/match-observable';

class PlayMatch {

    constructor(match) {
        this.match = match;
        matchObservable.subscribeScores((entity)=> {
            console.log(`${entity.constructor.name} score: ${JSON.stringify(entity.scores)}`)

        });
        matchObservable.subscribeWinner((entity)=> {
            console.log(`${entity.constructor.name} winner: ${JSON.stringify(entity.winnerId)}`)
       });
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

    updateQuestions() {
        this.questions.choices = [];
        this.map.clear();
        if (this.showMainMenu) {
            this.map.set('play', () => this.showMainMenu = false);
            this.map.set('quit', () => this.done = true);
        } else {
            let commands = Array.prototype.concat(
                [...this.match.setGameCommands()],
                [...this.match.matchSetCommands()],
                [...this.match.matchCommands()],
                [...this.match.otherCommands()]);
            for (let c of commands) {
                // this.questions.choices.push(c.title);
                this.map.set(c.title, () => this.match.commandInvoker.invoke(c));
            }
            this.map.set('menu', () => this.showMainMenu = true);
        }

        [...this.map.keys()].forEach((value) => this.questions.choices.push(value));

    }

    startPlay() {
        this.done = false;
        this.showMainMenu = true;
        this._play();
    }

    _play() {
        this.updateQuestions();
        inquirer.prompt(this.questions).then((answers) => {
            // console.log(answers);
            let fn = this.map.get(answers.command);
            fn();
            if (!this.done) {
                this._play();
            }
        })

    }
}

// function play() {
//     inquirer.prompt(questions).then(function (answers) {
//         output.push(answers.tvShow);
//         if (answers.askAgain) {
//             ask();
//         } else {
//             console.log('Your favorite TV Shows:', output.join(', '));
//         }
//     });
// }

let match = matchFactory.makeMatch();
let playMatch = new PlayMatch(match);
playMatch.startPlay();
