'use strict';
import inquirer from 'inquirer';
import {createPlayableMatch} from '../../match/playable-factory';
import {createNewMatch} from '../../match/factory';
import {Match, MatchSet, SetGame} from '../../match/entity'


function play() {

    let players = [];

    function playerId(name) {
        // provide a unique id for each player name
        let i = players.indexOf(name);
        if (i < 0) {
            i = players.length;
            players.push(name);
        }
        return i + 1;
    }

    const queries = {
        newMatch: 1,
        menu: 2
    };

    const menus = {
        play: 1,
        root: 2
    };

    class MatchPlay {

        constructor() {
            this.playable = undefined;
            this.commandMap = new Map();
            this.query = queries.menu;
            this.menu = menus.root;
            this.done = false;
            this.log = [];
            this.bottomBar = new inquirer.ui.BottomBar();
        }

        entityName(entity) {
            let name;
            if (entity instanceof SetGame)
                name = `game[${entity.index}]`;
            else if (entity instanceof MatchSet)
                name = `set[${entity.index}]`;
            else if (entity instanceof Match)
                name = 'match';
            return name;
        }

        createMatch(options) {
            options = options || {
                    singles: true,
                    players: [{id: 99}, {id: 333}]
                };

            const match = createNewMatch(options);
            // create match
            const playable = createPlayableMatch(match);

            // event handlers
            const observable = playable.match.observable;
            observable.subscribeScores((entity) => {
                const entityName = this.entityName(entity);
                this.log.push(`${entityName}.score = ${JSON.stringify(entity.scores)}`);
            });
            observable.subscribeWinner((entity) => {
                const entityName = this.entityName(entity);
                const name = playable.opponentNameService.getWinnerName(entity.winnerId);
                this.log.push(`${entityName}.winner = ${name}`);
            });

            // Resolve player names
            playable.playerNameService.idToName = (id) => players[id - 1];
            return playable;
        }

        showHistory() {
            for (const item of this.playable.historyList) {
                this.log.push(item.title);
            }
        }


        createRequest() {
            switch (this.query) {
                case queries.menu:
                    return {
                        questions: this.createMenuQuestions(),
                        handler: (answers) => this.commandMap.get(answers.command)()
                    };
                case queries.newMatch:
                    return {
                        questions: this.createNewMatchQuestions(),
                        handler: (answers) => {
                            let options = {singles: true, players: []};
                            options.players.push({id: playerId(answers.player1)});
                            options.players.push({id: playerId(answers.player2)});
                            this.playable = this.createMatch(options);
                            this.query = queries.menu;
                            this.menu = menus.play;
                        }
                    };
                default:
                    throw new Error('unexpected');
            }
        }

        createNewMatchQuestions() {
            const result = [];
            const playerCount = 2;
            for (let i = 1; i <= playerCount; i++) {
                result.push({
                    type: 'input',
                    name: `player${i}`,
                    message: `Player ${i}?`,
                    validate: function (value) {
                        var pass = value.match(/^[a-zA-Z]([a-zA-Z ]){0,29}$/);
                        if (pass) {
                            return true;
                        }

                        return 'Please enter a name';
                    }
                });
            }
            return result;
        }

        createMenuQuestions() {
            const result = {
                type: 'rawlist',
                name: 'command',
                message: 'What do you want to do?',
                choices: []
            };
            let rootMenu = false;
            const commandMap = this.commandMap;
            try {
                commandMap.clear();
                switch (this.menu) {
                    case menus.root:
                        if (this.playable) {
                            commandMap.set('play', () => this.menu = menus.play);
                            commandMap.set('history', () => this.showHistory());
                        }
                        commandMap.set('new', () => this.query = queries.newMatch);
                        commandMap.set('quit', () => this.done = true);
                        rootMenu = true;
                        break;
                    case menus.play:
                        for (let c of this.playable.allCommands()) {
                            commandMap.set(c.title, () => this.playable.commandInvoker.invoke(c));
                        }
                        break;
                    default:
                        throw new Error('unexpected');
                }
            }
            catch (e) {
                this.log.push(e);
                commandMap.clear();
            }
            if (!rootMenu)
                commandMap.set('menu', () => this.menu = menus.root);

            [...commandMap.keys()].forEach((value) => result.choices.push(value));

            return result;

        }

        play() {
            const promise = new Promise((resolve, reject) => {
                this.promptLoop(() => resolve('done'));
            });
            return promise;
        }

        promptLoop(done) {
            const request = this.createRequest();
            inquirer.prompt(request.questions)
                .then((answers) => {
                    if (request.handler) {
                        try {
                            request.handler(answers);
                            // Write messages log while handling command
                            while (this.log.length) {
                                const message = this.log.splice(0, 1)[0];
                                this.bottomBar.log.write(message);
                            }
                        } catch (e) {
                            this.bottomBar.log.write(e);
                        }
                    }
                    if (!this.done) {
                        this.promptLoop(done);
                    } else {
                        done();
                    }
                });
        }
    }
    return new MatchPlay().play();

}

play().then((value) => {
    console.log(value);
});

