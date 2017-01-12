import {
    Factory
} from 'aurelia-dependency-injection';

// Use DI container to create an instance.
function createFromFactory(container, klass, ...rest) {
    let factory = new Factory(klass);
    let fn = factory.get(container);
    return fn(...rest);
}

export {createFromFactory};

