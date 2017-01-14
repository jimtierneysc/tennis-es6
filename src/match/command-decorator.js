'use strict';

import {All} from 'aurelia-dependency-injection';
import {createFromFactory} from './di-util'
import 'aurelia-polyfills';

// Interface
class CommandDecorator {

    // Add properties to a command
    decorate(command) {

    }
}


class AllDecorators {
    static inject() {
        return [All.of(CommandDecorator)];
    }

    constructor(decorators) {
        this.decorators = decorators;
    }

    decorate(command) {
        if (this.decorators)
          this.decorators.forEach((decorator)=>{
            decorator.decorate(command)
          });

    }
}

let singleton;
function decorateCommand(container, command) {
    singleton = singleton || createFromFactory(container, AllDecorators);
    singleton.decorate(command);
}

export {
    decorateCommand, CommandDecorator
}



