'use strict';
import {
    Factory, Optional, Container
} from 'aurelia-dependency-injection';

/**
 * Dependency injection utilities
 */

/**
 * Creates an instance of a class using DI container
 * @param container The DI container.
 * @param key The class.
 * @param rest Additional parameters.
 * @return The class instance.
 */
function createFromFactory(container, key, ...rest) {
    const factory = new Factory(key);
    const fn = factory.get(container);
    return fn(...rest);
}

// Do not instantiate classes if the container has no instance
/**
 * Indicate that injected values are optional, and should not be instantiated
 * by DI container.
 * @param value An array of identifiers to inject.
 * @return An array of optional identifiers
 */
function makeOptional(value) {
    // (must not use Optional.of with Container)
    const newValue = value.map((value)=>value===Container ? Container : Optional.of(value));
    return newValue;

}

export {createFromFactory, makeOptional};

