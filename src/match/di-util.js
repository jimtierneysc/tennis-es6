'use strict';
import {
    Factory
} from 'aurelia-dependency-injection';

// Use DI container to create an instance.
function createFromFactory(container, key, ...rest) {
    let factory = new Factory(key);
    let fn = factory.get(container);
    return fn(...rest);
}

export {createFromFactory};

