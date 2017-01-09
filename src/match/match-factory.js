// import {Match} from './match-entity'
import {MatchStrategy} from './match-strategy'
import {PlayableMatch} from './match-playable'
import {MatchCharacteristics} from './match-characteristics'
import {MatchCommandInvoker} from './match-command-invoker'
import {MatchHistoryList} from './match-history'
import {Container} from 'aurelia-dependency-injection';
import {Match} from './match-entity';


class MatchFactory {

    // static Kinds = {
    //     SINGLES: 'SINGLES',
    //     DOUBLES: 'DOUBLES',
    // };
    //
    // static Scoring = {
    //     TWOSETS: 'TWOSETS',
    //     THREESETS: 'THREESETS'
    // };


    makeMatchCommon(characteristics, value) {

        // TODO: Get kinds for elsewhere

        // 0. Register all objects with container
        // 0.1 pass container to constructors?  Or just instantiate using containers and
        // contructor will get objects implicitely?  or pass root object that has container
        // 1. create container
        // 2. Add historyList
        // 2.1 add invoker
        // 3. add match
        // 4. add command factory
        // 5. add/inject match strategies
        // (add everything to container here)
        // (create all commands with Di)
        // for consistency, always use factory to create object?

        let container = new Container();
        let historyList = new MatchHistoryList();
        let strategy = new MatchStrategy(characteristics); // TODO: get from match value
        let match = strategy.createMatch(value);
        let commandStrategy = strategy.createCommandStrategy(container, match);
        let commandInvoker = new MatchCommandInvoker(historyList);  // TODO: load invoker
        container.registerInstance(Match, match);
        container.registerInstance(MatchCommandInvoker, commandInvoker);
        return new PlayableMatch(container, match, commandStrategy, commandInvoker, historyList);

    }


    makeMatch(characteristics) {

        // // TODO: Get kinds for elsewhere
        //
        // let historyList = new MatchHistoryList();
        // let strategy = new MatchStrategy(characteristics);
        // let match = strategy.createMatch();
        // let commandStrategy = strategy.createCommandStrategy(match);
        // let commandInvoker = new MatchCommandInvoker(historyList);
        // return new PlayableMatch(match, commandStrategy, commandInvoker, historyList);
        return this.makeMatchCommon(characteristics);

    }

    makeMatchFromValue(value) {

        // // TODO: Get kinds for elsewhere
        //
        // let historyList = new MatchHistoryList();
        // let strategy = new MatchStrategy(); // TODO: get from match value
        // let match = strategy.createMatch(value);
        // let commandStrategy = strategy.createCommandStrategy(match);
        // let commandInvoker = new MatchCommandInvoker(historyList);  // TODO: load invoker
        // return new PlayableMatch(match, commandStrategy, commandInvoker, historyList);
        return this.makeMatchCommon(undefined, value);

    }

    // makeMatch(value) {
    //
    //     return makeMatch(value.kind, value.scoring);
    //
    // }

}


export let matchFactory = new MatchFactory();


