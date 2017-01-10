import {Match} from './match-entity'
class MatchFactory {

    createMatch(options) {
        let match = new Match();
        // TODO: don't add players
        this.addPlayers(match, { singles: true});
        return match;

    }

    loadMatch(value) {
        let match = new Match(value);
        return match;

    }

    // TODO: Remove
    addPlayers(match, options) {
        let playerCount = 0;
        if (options.doubles) {
            playerCount = 4;
        }

        if (options.singles) {
            playerCount = 2;
        }

        let opponent = match.opponents.first;
        for (let i = 1; i <= playerCount; i++) {
            let player = match.players.list.add();
            opponent.players.add().id = player.id;
            if (i === playerCount / 2) {
                opponent = match.opponents.second;
            }
        }
    }

}

export let matchFactory = new MatchFactory();
