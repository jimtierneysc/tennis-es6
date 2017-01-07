// import {Match} from './match-entity'
import {MatchStrategy} from './match-strategy'
import {PlayableMatch} from './match-playable'
import {MatchCharacteristics} from './match-characteristics'
import {MatchCommandInvoker} from './match-command-invoker'


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

        let strategy = new MatchStrategy(characteristics);
        let match = strategy.createMatch();
        let commandStrategy = strategy.createCommandStrategy(match);
        let commandInvoker = new MatchCommandInvoker();
        return new PlayableMatch(match, commandStrategy, commandInvoker);

    }

    makeMatchFromValue(value) {

        // TODO: Get kinds for elsewhere

        let strategy = new MatchStrategy([]); // TODO: get from match value
        let match = strategy.createMatch(value);
        let commandStrategy = strategy.createCommandStrategy(match);
        let commandInvoker = new MatchCommandInvoker();  // TODO: load invoker
        return new PlayableMatch(match, commandStrategy, commandInvoker);

    }

    // makeMatch(value) {
    //
    //     return makeMatch(value.kind, value.scoring);
    //
    // }

}


export let matchFactory = new MatchFactory();


