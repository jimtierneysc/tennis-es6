// import {MatchStrategy} from './match-commandStrategy'

import {MatchComponent, MatchComponentList} from './match-component';

class MatchHistoryList extends MatchComponentList {
    constructor(value) {
        super(null, null, value || []);
    }

    addCommand(command) {
        const result = new MatchHistoryCommandItem(this);
        result.saveCommand(command);
        return result;
    }
}

class MatchHistoryItem extends MatchComponent {
    constructor(owner, value) {
        super(owner, owner, value || {});
    }

}

// TODO: create with DI
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

export {MatchHistoryList, MatchHistoryCommandItem}


