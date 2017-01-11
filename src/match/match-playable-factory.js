// import {Match} from './match-entity'
import {PlayableMatch} from './match-playable'
import {MatchCommandInvoker} from './match-command-invoker'
import {MatchHistoryList} from './match-history'
import {Container} from 'aurelia-dependency-injection';
import {Match} from './match-entity';
import {createNewMatch, createMatchFromValue} from './match-factory';
import {MatchPlayableServices} from './match-playable-services';


class PlayableMatchFactory {

    static createMatchCommon(value, options, create) {

        // DI container
        const container = new Container();
        container.registerInstance(Container, container);

        // Match entity
        const match = create();
        container.registerInstance(Match, match);

        // Keep history of execute commands
        container.registerInstance(MatchHistoryList, container.get(MatchHistoryList));

        // Command invoker
        container.registerInstance(MatchCommandInvoker, container.get(MatchCommandInvoker));

        // Services to play this match
        const services = container.get(MatchPlayableServices);

        // Register services with DI container
        services.register(container);

        // Get ready to play
        services.run();

        const result = new PlayableMatch(container);
        return result;
    }

    static createNew(options) {
        return PlayableMatchFactory.createMatchCommon(undefined, options,
            () => createNewMatch(options));
    }

    static createFromValue(value) {
        return PlayableMatchFactory.createMatchCommon(value,
            () => createMatchFromValue(value));
    }
}


export let createNewPlayableMatch = PlayableMatchFactory.createNew;
export let createPlayableMatchFromValue = PlayableMatchFactory.createFromValue;


