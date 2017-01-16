'use strict';
import inquirer from 'inquirer';
import {createPlayableMatch} from '../../match/playable-factory';
import {createNewMatch} from '../../match/factory';
import {PlayerNameService, OpponentNameService} from '../../match/name-service'
import {CommandDecorator} from '../../match/command-decorator'
import {CommandTitleDecorator} from '../../match/command-title-decorator'
import {MatchHistory} from '../../match/history'
import {MatchHistoryList} from '../../match/history-list'
import {Match, MatchSet, SetGame} from '../../match/model'
import {createFromFactory} from '../../match/di-util'
import {MatchOptions} from '../../match/options'


function play() {

    // list of player names
    const players = [];

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
        playerNames: 4,
        matchScoring: 5
    };

    class MatchPlay {

        constructor() {
            this.playable = undefined;
            this.mode = modes.mainMenu;
            this.messages = [];
            this.bottomBar = new inquirer.ui.BottomBar();
            this.matchOptions = {};
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

        createMatch() {
            // create match entity
            const match = createNewMatch(this.matchOptions);
            // create services to play match
            const playable = createPlayableMatch(match, this.matchRegister);

            this.subscribe(playable);

            return playable;
        }

        matchRegister(container) {
            // Add optional services

            // Keep history of executed commands
            container.registerInstance(MatchHistory, createFromFactory(container, MatchHistoryList));

            // Add name services to provide player names from id
            const playerNameService = createFromFactory(container, PlayerNameService);
            playerNameService.idToName = (id) => players[id - 1];
            container.registerInstance(PlayerNameService, playerNameService);
            container.registerInstance(OpponentNameService, createFromFactory(container, OpponentNameService));

            // Decorate commands with title
            container.registerInstance(CommandDecorator, createFromFactory(container, CommandTitleDecorator));
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
                const name = playable.opponentNameService.getOpponentName(entity.winnerId);
                this.messages.push(`${entityName}.winner = ${name}`);
            });
        }

        showHistory() {
            for (const item of this.playable.history.list) {
                this.messages.push(item.title);
            }
        }

        createRequest() {
            switch (this.mode) {
                case modes.mainMenu:
                case modes.playMenu:
                    const commandMap = new Map();
                    return {
                        questions: this.menuQuestions(commandMap),
                        handler: (answers, quit) => commandMap.get(answers.command)(quit)
                    };
                case modes.matchKind:
                    return {
                        questions: this.matchKindQuestions(),
                        handler: (answers) => {
                            this.matchOptions = {};
                            if (MatchOptions.kinds.includes(answers.kind)) {
                                this.matchOptions.kind = answers.kind;
                                this.mode = modes.playerNames;
                            } else {
                                this.mode = modes.menu;
                            }
                        }
                    };
                case modes.playerNames:
                    return {
                        questions: this.playerNamesQuestions(),
                        handler: (answers) => {
                            const options = this.matchOptions;
                            options.players = [];
                            this.playerNameFields.forEach((name)=>{
                                const player = {id: playerId(answers[name])};
                                options.players.push(player);
                            });
                            this.mode = modes.matchScoring;
                        }
                    };
                case modes.matchScoring:
                    return {
                        questions: this.matchScoringQuestions(),
                        handler: (answers) => {
                            if (MatchOptions.scorings.includes(answers.scoring)) {
                                this.matchOptions.scoring = answers.scoring;
                                this.playable = this.createMatch();
                                this.mode = modes.playMenu;
                            } else {
                                this.mode = modes.mainMenu;
                            }
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
                choices: [...MatchOptions.kinds, 'never mind']
            };
            return result;
        }

        matchScoringQuestions() {
            const result = {
                type: 'rawlist',
                name: 'scoring',
                message: 'What scoring?',
                choices: MatchOptions.scorings
            };
            return result;
        }

        get playerNameFields() {
            const result = [];
            const count = MatchOptions.playerCount(this.matchOptions);
            for (let i = 1; i <= count; i++) {
                result.push(`p${i}`);
            }
            return result;
        }

        playerNamesQuestions() {
            const result = [];
            this.playerNameFields.forEach((name, i)=> {
                result.push({
                    type: 'input',
                    name: name,
                    message: `Player ${i+1}?`,
                    validate: function (value) {
                        var pass = value.match(/^[a-zA-Z]([a-zA-Z ]){0,29}$/);
                        if (pass) {
                            return true;
                        }

                        return 'Please enter a name';
                    }
                });
            });
            return result;
        }

        menuQuestions(commandMap) {
            const result = {
                type: 'rawlist',
                name: 'command',
                message: 'What do you want to do?',
                choices: []
            };
            let rootMenu = false;
            try {
                commandMap.clear();
                switch (this.mode) {
                    case modes.mainMenu:
                        if (this.playable) {
                            commandMap.set('play', () => this.mode = modes.playMenu);
                            commandMap.set('history', () => this.showHistory());
                        }
                        commandMap.set('new', () => this.mode = modes.matchKind);
                        commandMap.set('quit', (quit) => quit());
                        rootMenu = true;
                        break;
                    case modes.playMenu:
                        for (const c of this.playable.allCommands()) {
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
                let quit = false;
                try {
                    request.handler(answers, ()=>quit = true);
                    // Write messages that were posted while handling request
                    while (this.messages.length) {
                        const message = this.messages.splice(0, 1)[0];
                        this.bottomBar.log.write(message);
                    }
                } catch (e) {
                    this.bottomBar.log.write(e);
                }
                if (!quit) {
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

