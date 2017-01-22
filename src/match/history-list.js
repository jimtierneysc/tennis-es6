'use strict';
import {MatchHistory} from './history';
import {MatchComponentList, MatchComponent} from './component'

/**
 * Implementation of MatchHistory
 */

class MatchHistoryList extends MatchHistory {

    constructor(value) {
        super();
        this._list = new MatchComponentList(null, null, value);
    }

    addCommand(command) {
        const item = new MatchHistoryCommandItem(this.list);
        item.saveCommand(command);
    }

    get list() {
        return this._list;
    }
}

class MatchHistoryItem extends MatchComponent {
    constructor(parent, value) {
        super(parent, value || {});
    }

}

class MatchHistoryCommandItem extends MatchHistoryItem {

    get title() {
        return this.value.title;
    }

    saveCommand(command) {
        this.value.className = command.constructor.name;
        this.value.title = command.title;
        this.value.params = command.params;
    }

}

export {MatchHistoryList}


