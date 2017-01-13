'use strict';
import {PlayableMatch} from './playable'
import {Container} from 'aurelia-dependency-injection';
import {Match} from './entity';
import {PlayableMatchServices} from './playable-services';
import {createFromFactory} from './di-util'


class PlayableMatchFactory {

    static create(match) {

        // DI container
        const container = new Container();
        container.registerInstance(Container, container);

        // Match entity
        container.registerInstance(Match, match);

        // Services to play this match
        const services = createFromFactory(container, PlayableMatchServices);

        // Register services with DI container
        services.register(container);

        // Get ready to play
        services.run();

        const result = new PlayableMatch(container);
        return result;
    }

 }


export let createPlayableMatch = PlayableMatchFactory.create;


