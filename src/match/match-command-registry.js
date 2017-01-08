class MatchCommandRegistry {

    constructor() {
      this._map = new Map();
    }

    get map() {
        return this._map;
    }

    register(klass) {
        this.map.set(klass.name, klass);

    }

    getClass(name) {
        return this.map.get(name)
    }
}


export let matchCommandRegistry = new MatchCommandRegistry();