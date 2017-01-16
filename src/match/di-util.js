'use strict';
import {
    Factory, Optional, Container
} from 'aurelia-dependency-injection';

// Use DI container to create an instance.
function createFromFactory(container, key, ...rest) {
    let factory = new Factory(key);
    let fn = factory.get(container);
    return fn(...rest);
}

// Do not instantiate classes if the container has no instance
function makeOptional(value) {
    // (must not use Optional.of with Container)
    const newValue = value.map((value)=>value===Container ? Container : Optional.of(value));
    return newValue;

}

export {createFromFactory, makeOptional};

