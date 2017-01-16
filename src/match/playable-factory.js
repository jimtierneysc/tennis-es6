'use strict';
import {PlayableMatch} from './playable'
import {Container} from 'aurelia-dependency-injection';
import {Match} from './model';
import {PlayableServices} from './playable-services';
import {createFromFactory} from './di-util'


class PlayableMatchFactory {

    static create(match, register) {

        // DI container
        const container = new Container();

        // Match entity
        container.registerInstance(Match, match);

        // Services to play this match
        const services = createFromFactory(container, PlayableServices);

        // Register services with DI container
        services.register(container);
        if (register) {
            register(container);
        }

        const result = new PlayableMatch(container);
        // Get ready to play
        services.run(result);

        return result;
    }

 }


export const createPlayableMatch = PlayableMatchFactory.create;


