// import {MatchStrategy} from './match-commandStrategy'

import {ScoreComponent, ScoreComponentList} from './match-component';

class MatchHistoryList extends ScoreComponentList {
    constructor(value) {
        super(null, value || []);
    }

    factory(value) {
        return new MatchHistoryCommand(this, value);
    }

    addCommand(command) {
        const result = new MatchHistoryCommand(this);
        result.saveCommand(command);
        return result;
    }
}

// TODO: create with DI
class MatchHistoryCommand extends ScoreComponent{
    constructor(owner, value) {
        super(owner, value || {});
    }

    get title() {
        return this.value.title;
    }

    saveCommand(command) {
        this.value.className = command.constructor.name;
        this.value.title = command.title;
        this.value.params = command.params;
    }

}

export {MatchHistoryList, MatchHistoryCommand}


