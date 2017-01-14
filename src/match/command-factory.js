
import {decorateCommand} from './command-decorator'
import {createFromFactory} from './di-util'

// Use DI container to create an instance.
function createCommand(container, key, ...rest) {
    const command = createFromFactory(container, key, ...rest);
    decorateCommand(container, command);
    return command;

}

export {createCommand}
