
import {decorateCommand} from './command-decorator'
import {createFromFactory} from './di-util'

/**
 * Command factory
 *
 * Use createCommand() to properly create a Command instance.
 */

/**
 * Creates the command.
 * @param container The DI container.
 * @param key The class.
 * @param rest Additional parameters.
 * @return The command instance.
 */
function createCommand(container, key, ...rest) {
    const command = createFromFactory(container, key, ...rest);
    decorateCommand(container, command);
    return command;

}

export {createCommand}
