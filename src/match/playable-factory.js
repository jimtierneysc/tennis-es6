'use strict';
import {PlayableMatch} from './playable'
import {Container} from 'aurelia-dependency-injection';
import {Match} from './entity';
import {PlayableMatchServices} from './playable-services';
import {createFromFactory} from './di-util'


class PlayableMatchFactory {

    static create(match, register, run) {

        // DI container
        const container = new Container();
        container.registerInstance(Container, container);

        // Match entity
        container.registerInstance(Match, match);

        // Services to play this match
        const services = createFromFactory(container, PlayableMatchServices);

        // Register services with DI container
        services.register(container);
        if (register) {
            register(container);
        }

        const result = new PlayableMatch(container);
        // Get ready to play
        services.run(result);
        if (run)
            run(result);

        return result;
    }

 }


export let createPlayableMatch = PlayableMatchFactory.create;


