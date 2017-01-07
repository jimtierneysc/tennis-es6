import * as _ from 'lodash'
// import {matchObservable} from './match-observable'

// TODO: Parent vs. Owner
class ScoreComponent {
    constructor(owner, value) {
        this._childList = undefined;
        this._owner = owner;
        this._value = value || {};
        if (owner) {
            this._owner.addChild(this);
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
        return this._owner;
    }

    get value() {
        return this._value;
    }

    childRemoved(component) { // virtual

    }

    childAdded(component) {

    }

    removeChild(component) {
        this.childRemoved(component);
    }

    // TODO: Set owner, remove from previous owner
    addChild(component) {
        this.childAdded(component);
    }

    isEqualValue(value) {
        return _.isEqual(value, this.value);
    }

    get index() {
        if (this.owner && this.owner.indexOf) {
            return this.owner.indexOf(this)
        }
    }

}

class ScoreComponentList extends ScoreComponent {
    constructor(owner, value) {
        super(owner, value || []);
        this._childList = [];
        this.constructChildren();
    }

    constructChildren() {
        this.value.forEach((i) => this.factory(i));
    }

    removeChild(component) {
        const i = this._childList.indexOf(component);
        if (i >= 0) {
            this._childList.splice(i, 1);
            this.childRemoved(component);
        }
    }

    // TODO: Set owner, remove from previous owner
    addChild(component) {
        this._childList.push(component);
        this.childAdded(component);
    }

    childRemoved(component) {
        const i = this.value.indexOf(component.value);
        if (i >= 0) {
            this.value.splice(i, 1);
        }
    }

    // Override
    childAdded(component) {
        const i = this.value.indexOf(component.value);
        if (i < 0) {
            this.value.push(component.value);
        }
    }

    get count() {
        return this._childList.length;
    }

    get last() {
        const len = this._childList.length;
        if (len > 0)
            return this._childList[len - 1];
    }

    removeLast() {
        const item = this.last;
        if (item) {
            this.removeChild(item);
        }
    }

    * [Symbol.iterator]() {
        for (const arg of this._childList) {
            yield arg;
        }
    }

    add() {
        const result = this.factory();
        return result;
    }

    factory(value) {
        // TODO: Raise exception
        return null;
    }

    containsValue(value) {
        for (let i of this) {
            if (i.isEqualValue(value)) {
                return true;
            }
        }
    }

    contains(entity) {
        for (let i of this) {
            if (i === entity) {
                return true;
            }
        }
    }

    indexOf(entity) {
        let index = 0;
        for (let i of this) {
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

export {ScoreComponent, ScoreComponentList}
