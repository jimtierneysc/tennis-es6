import {
    StartWarmup, StartPlay, StartOver, StartSet, StartMatchTiebreak,
    StartGame, StartSetTiebreak, WinMatchTiebreak,
    WinGame, WinSetTiebreak, UndoOperation
} from '../src/match/match-command';

class Utils {
    static findCommand(commands, type) {
        return commands.find((value) => value instanceof type);
    }

    static filterCommands(commands, type) {
        return commands.filter((value) => {
            return value instanceof type
        });
    }

    static tryStartSet(playableMatch) {
        let commands = Utils.filterCommands([...playableMatch.matchCommands()], StartPlay);
        if (commands.length > 0)
            playableMatch.commandInvoker.invoke(commands[0]); // start play
        commands = Utils.filterCommands([...playableMatch.matchCommands()], StartSet);
        if (commands.length > 0)
            playableMatch.commandInvoker.invoke(commands[0]); // start set
    }

    static startWarmup(playableMatch) {
        let commands = Utils.filterCommands([...playableMatch.matchCommands()], StartWarmup);
        playableMatch.commandInvoker.invoke(commands[0]); // start warmup
    }

    static startPlay(playableMatch, server) {
        server = server || 0;
        let commands = Utils.filterCommands([...playableMatch.matchCommands()], StartPlay);
        playableMatch.commandInvoker.invoke(commands[server]); // start play
    }

    static tryStartGame(playableMatch) {
        let commands = Utils.filterCommands([...playableMatch.matchSetCommands()], StartGame);
        if (commands.length > 0)
            playableMatch.commandInvoker.invoke(commands[0]);
    }

    static winGame(playableMatch, opponent) {
        let commands = Utils.filterCommands([...playableMatch.setGameCommands()], WinGame);
        if (commands.length > 0)
            playableMatch.commandInvoker.invoke(commands[opponent - 1]);
        else
            throw new Error('can\'t win game');
    }

    static startSetTiebreak(playableMatch) {
        let commands = Utils.filterCommands([...playableMatch.matchSetCommands()], StartSetTiebreak);
        if (commands.length > 0)
            playableMatch.commandInvoker.invoke(commands[0]);
        else
            throw new Error('can\'t start set tiebreak');
    }

    static winSetTiebreak(playableMatch, opponent) {
        let commands = Utils.filterCommands([...playableMatch.setGameCommands()], WinSetTiebreak);
        if (commands.length > 0)
            playableMatch.commandInvoker.invoke(commands[opponent - 1]);
        else
            throw new Error('can\'t win set tiebreak');
    }

    static winGames(playableMatch, opponent, count) {
        Utils.tryStartSet(playableMatch);
        while (count--) {
            Utils.tryStartGame(playableMatch);
            Utils.winGame(playableMatch, opponent);
        }
    }

    static winSet(playableMatch, opponent) {
        Utils.tryStartSet(playableMatch);
        while (!playableMatch.match.sets.last.winnerId) {
            Utils.winGames(playableMatch, opponent, 1);
        }
    }

    static startMatchTiebreak(playableMatch) {
        let commands = Utils.filterCommands([...playableMatch.matchCommands()], StartMatchTiebreak);
        if (commands.length === 0)
            throw new Error('Can\'t start match tiebreak');
        playableMatch.commandInvoker.invoke(commands[0]);
    }

    static winMatchTiebreak(playableMatch, opponent) {
        let commands = Utils.filterCommands([...playableMatch.setGameCommands()], WinMatchTiebreak);
        if (commands.length === 0)
            throw new Error('Can\'t win match tiebreak');
        playableMatch.commandInvoker.invoke(commands[opponent - 1]);
    }

    static hasCommands(playableMatch, classes) {
        let commands = [...playableMatch.allCommands()].map((value) => value.constructor.name);
        let result = classes.length === commands.length;
        if (result) {
            let classNames = classes.map((value) => value.name);
            result = commands.sort().join() === classNames.sort().join();
        }
        if (!result) {
            let classNames = classes.map((value) => value.name);
            console.log(`commands: ${commands.sort().join(',')}`)
            console.log(`classNames: ${classNames.sort().join(',')}`)
        }
        return result;
    }
}

export {Utils};




