'use strict';
import inquirer from 'inquirer';
import {createPlayableMatch} from '../../match/playable-factory';
import {createNewMatch} from '../../match/factory';
import {Match, MatchSet, SetGame} from '../../match/entity'


function play() {

    // list of player names
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

    const modes = {
        playMenu: 1,
        mainMenu: 2,
        matchKind: 3,
        playerNames: 4
    };

    class MatchPlay {

        constructor() {
            this.playable = undefined;
            this.commandMap = new Map();
            this.mode = modes.mainMenu;
            this.done = false;
            this.messages = [];
            this.bottomBar = new inquirer.ui.BottomBar();
            this.createMatchOptions = {};
        }

        // Translate class name to a title
        entityTitle(entity) {
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
            // create match entity
            const match = createNewMatch(options);
            // create services to play match
            const playable = createPlayableMatch(match);

            this.subscribe(playable);
            this.resolvePlayerNames(playable);

            return playable;
        }

        subscribe(playable) {
            // event handlers
            const observable = playable.match.observable;
            observable.subscribeScores((entity) => {
                const entityName = this.entityTitle(entity);
                this.messages.push(`${entityName}.score = ${JSON.stringify(entity.scores)}`);
            });
            observable.subscribeWinner((entity) => {
                const entityName = this.entityTitle(entity);
                const name = playable.opponentNameService.getWinnerName(entity.winnerId);
                this.messages.push(`${entityName}.winner = ${name}`);
            });
        }

        resolvePlayerNames(playable) {
            // Provide our player names
            playable.playerNameService.idToName = (id) => {
                return players[id - 1];
            }
        }

        showHistory() {
            for (const item of this.playable.historyList) {
                this.messages.push(item.title);
            }
        }

        createRequest() {
            switch (this.mode) {
                case modes.mainMenu:
                case modes.playMenu:
                    return {
                        questions: this.menuQuestions(),
                        handler: (answers) => this.commandMap.get(answers.command)()
                    };
                case modes.matchKind:
                    return {
                        questions: this.matchKindQuestions(),
                        handler: (answers) => {
                            this.createMatchOptions = {};
                            if (answers.kind !== 'singles') {
                                this.createMatchOptions.doubles = true;
                            }
                            this.mode = modes.playerNames;
                        }
                    };
                case modes.playerNames:
                    return {
                        questions: this.playerNamesQuestions(),
                        handler: (answers) => {
                            let options = this.createMatchOptions;
                            options.players = [];
                            options.players.push({id: playerId(answers.player1)});
                            options.players.push({id: playerId(answers.player2)});
                            if (options.doubles) {
                                options.players.push({id: playerId(answers.player3)});
                                options.players.push({id: playerId(answers.player4)});
                            }
                            this.playable = this.createMatch(options);
                            this.mode = modes.playMenu;
                        }
                    };
                default:
                    throw new Error(`unexpected: ${this.mode}`);
            }
        }

        matchKindQuestions() {
            const result = {
                type: 'rawlist',
                name: 'kind',
                message: 'What kind of match?',
                choices: ['singles', 'doubles']
            };
            return result;
        }

        playerNamesQuestions() {
            const result = [];
            const playerCount = this.createMatchOptions.doubles ? 4 : 2;
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

        menuQuestions() {
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
                switch (this.mode) {
                    case modes.mainMenu:
                        if (this.playable) {
                            commandMap.set('play', () => this.mode = modes.play);
                            commandMap.set('history', () => this.showHistory());
                        }
                        commandMap.set('new', () => this.mode = modes.matchKind);
                        commandMap.set('quit', () => this.done = true);
                        rootMenu = true;
                        break;
                    case modes.playMenu:
                        for (let c of this.playable.allCommands()) {
                            commandMap.set(c.title, () => this.playable.commandInvoker.invoke(c));
                        }
                        break;
                    default:
                        throw new Error(`unexpected ${this.mode}`);
                }
            }
            catch (e) {
                this.messages.push(e);
                commandMap.clear();
            }
            if (!rootMenu)
                commandMap.set('menu', () => this.mode = modes.mainMenu);

            [...commandMap.keys()].forEach((value) => result.choices.push(value));

            return result;
        }

        promptLoop(resolve) {
            const request = this.createRequest();
            inquirer.prompt(request.questions).then((answers) => {
                try {
                    request.handler(answers);
                    // Write messages that were posted while handling request
                    while (this.messages.length) {
                        const message = this.messages.splice(0, 1)[0];
                        this.bottomBar.log.write(message);
                    }
                } catch (e) {
                    this.bottomBar.log.write(e);
                }
                if (!this.done) {
                    this.promptLoop(resolve);
                } else {
                    resolve('done');
                }
            });
        }

        play() {
            const promise = new Promise((resolve) => this.promptLoop(resolve));
            return promise;
        }

    }
    return new MatchPlay().play();

}

play().then(
    (value) => console.log(value),
    (error) => console.log(error)
);

