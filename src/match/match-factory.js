// import {Match} from './match-entity'
import {MatchStrategy} from './match-strategy'
import {PlayableMatch} from './match-playable'
import {MatchCharacteristics} from './match-characteristics'
import {MatchCommandInvoker} from './match-command-invoker'
import {MatchHistoryList} from './match-history'


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

    makeMatch(characteristics) {

        // TODO: Get kinds for elsewhere

        let historyList = new MatchHistoryList();
        let strategy = new MatchStrategy(characteristics);
        let match = strategy.createMatch();
        let commandStrategy = strategy.createCommandStrategy(match);
        let commandInvoker = new MatchCommandInvoker(historyList);
        return new PlayableMatch(match, commandStrategy, commandInvoker, historyList);

    }

    makeMatchFromValue(value) {

        // TODO: Get kinds for elsewhere

        let historyList = new MatchHistoryList();
        let strategy = new MatchStrategy([]); // TODO: get from match value
        let match = strategy.createMatch(value);
        let commandStrategy = strategy.createCommandStrategy(match);
        let commandInvoker = new MatchCommandInvoker(historyList);  // TODO: load invoker
        return new PlayableMatch(match, commandStrategy, commandInvoker, historyList);

    }

    // makeMatch(value) {
    //
    //     return makeMatch(value.kind, value.scoring);
    //
    // }

}


export let matchFactory = new MatchFactory();


