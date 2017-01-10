// import {Match} from './match-entity'
import {MatchStrategy} from './match-strategy'
import {PlayableMatch} from './match-playable'
import {MatchCommandInvoker} from './match-command-invoker'
import {MatchHistoryList} from './match-history'
import {Container} from 'aurelia-dependency-injection';
import {Match} from './match-entity';
import {matchFactory} from './match-factory';
import {MatchPlayableServices} from './match-playable-services';


class PlayableMatchFactory {


    // TODO: Support options (e.g.; options.doubles)
    makeMatchCommon(options, value) {

        // DI container
        const container = new Container();
        container.registerInstance(Container, container);

        // Match entity
        const match = (value) ? matchFactory.loadMatch(value) : matchFactory.createMatch();
        container.registerInstance(Match, match);

        // Command history list
        container.registerInstance(MatchHistoryList, new MatchHistoryList());

        // Command invoker
        container.registerInstance(MatchCommandInvoker, container.get(MatchCommandInvoker));

        // Services to play this match
        const services = container.get(MatchPlayableServices);

        // Register services with DI container
        services.register(container);

        const result =  new PlayableMatch(container);
        result.dispose = ()=> services.dispose(); // clean up events
        return result;
    }

    makeMatch(options) {
        return this.makeMatchCommon(options);
    }

    makeMatchFromValue(value) {
        return this.makeMatchCommon(undefined, value);
    }
}


export let playableMatchFactory = new PlayableMatchFactory();


