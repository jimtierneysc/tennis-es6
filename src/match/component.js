'use strict';
import * as _ from 'lodash'

/**
 * Base classes for the match model
 *
 * These classes are responsible for owner/parent/child relationships
 * between match entities.
 *
 * Each class has a value property, which has the serializable JSON representation of the entity.
 */

// containers for read only properties
const _childList = new WeakMap();
const _owner = new WeakMap();
const _parent = new WeakMap();
const _value = new WeakMap();

class MatchComponent {
    constructor(owner, parent, value) {
        _owner.set(this, owner);
        _value.set(this, value || {});
        if (parent && parent.addChild) {
            parent.addChild(this);
        } else {
            _parent.set(this, parent);
        }
    }

    initValue(member, defValue) {
        if (!(member in this.value)) {
            this.value[member] = defValue;
        }
        return this.value[member];
    }

    initArray(member) {
        return this.initValue(member, []);
    }

    initObj(member) {
        return this.initValue(member, {});
    }

    get owner() {
        return _owner.get(this);
    }

    get parent() {
        return _parent.get(this);
    }

    get value() {
        return _value.get(this);
    }

    isEqualValue(value) {
        return _.isEqual(value, this.value);
    }

    get index() {
        if (this.parent && this.parent.indexOf) {
            return this.parent.indexOf(this)
        }
    }
}

class MatchComponentList extends MatchComponent {
    constructor(owner, parent, value) {
        super(owner, parent, value || []);
        _childList.set(this, []);
        this.constructChildren();
    }

    constructChildren() {
        this.value.forEach((i) => this.factory(i));
    }

    get childList() {
        return _childList.get(this);
    }

    removeChild(component) {
        _parent.set(component, undefined);
        const childList = _childList.get(this);
        const i = childList.indexOf(component);
        if (i >= 0) {
            childList.splice(i, 1);
            // this._childRemoved(component);
            const j = this.value.indexOf(component.value);
            if (j >= 0) {
                this.value.splice(j, 1);
            }
        }
    }

    addChild(component) {
        if (component.parent) {
            component.parent.removeChild(component);
        }
        _parent.set(component, this);
        _childList.get(this).push(component);
        const i = this.value.indexOf(component.value);
        if (i < 0) {
            this.value.push(component.value);
        }
    }

    get count() {
        return _childList.get(this).length;
    }

    get last() {
        const childList = _childList.get(this);
        const len = childList.length;
        if (len > 0)
            return childList[len - 1];
    }

    removeLast() {
        const item = this.last;
        if (item) {
            this.removeChild(item);
        }
    }

    * [Symbol.iterator]() {
        for (const arg of this.childList) {
            yield arg;
        }
    }

    add() {
        const result = this.factory();
        return result;
    }

    factory() {
        throw new Error('Not implemented');
    }

    containsValue(value) {
        for (const i of this) {
            if (i.isEqualValue(value)) {
                return true;
            }
        }
    }

    contains(entity) {
        for (const i of this) {
            if (i === entity) {
                return true;
            }
        }
    }

    indexOf(entity) {
        let index = 0;
        for (const i of this) {
            if (i === entity) {
                return index;
            }
            index++;
        }
    }

    clear() {
        while(this.count) {
            this.removeLast();
        }
    }

}

export {MatchComponent, MatchComponentList}
