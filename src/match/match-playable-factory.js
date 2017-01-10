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

    makeMatchCommon(options, value) {

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
        let match = (value) ? matchFactory.loadMatch(value) : matchFactory.createMatch();
        container.registerInstance(Match, match);
        container.registerInstance(MatchHistoryList, new MatchHistoryList());
        container.registerInstance(MatchCommandInvoker, container.get(MatchCommandInvoker));
        let services = new MatchPlayableServices(container, match); // TODO: get from match value
        container.registerInstance(MatchPlayableServices, services);
        for (const service of services) {
            container.registerHandler(service.key, service.get);
        }
        return new PlayableMatch(container);
    }


    makeMatch(options) {

        return this.makeMatchCommon(options);

    }

    makeMatchFromValue(value) {
        return this.makeMatchCommon(undefined, value);

    }
}


export let playableMatchFactory = new PlayableMatchFactory();


