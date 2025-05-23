/**
 * ██████╗  ██████╗ ██████╗ ███████╗    ███╗   ███╗███████╗██████╗ ██╗ █████╗ ████████╗ ██████╗ ██████╗
 * ██╔════╝ ██╔═══██╗██╔══██╗██╔════╝    ████╗ ████║██╔════╝██╔══██╗██║██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
 * ██║      ██║   ██║██████╔╝███████╗    ██╔████╔██║█████╗  ██║  ██║██║███████║   ██║   ██║   ██║██████╔╝
 * ██║      ██║▄▄ ██║██╔══██╗╚════██║    ██║╚██╔╝██║██╔══╝  ██║  ██║██║██╔══██║   ██║   ██║   ██║██╔══██╗
 * ╚██████╗ ╚██████╔╝██║  ██║███████║    ██║ ╚═╝ ██║███████╗██████╔╝██║██║  ██║   ██║   ╚██████╔╝██║  ██║
 *  ╚═════╝  ╚══▀▀═╝ ╚═╝  ╚═╝╚══════╝    ╚═╝     ╚═╝╚══════╝╚═════╝ ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
 *                                                                                       @vanguard-nx/cqrs
 *                                                                                       v1.0.0
 *
 * A powerful, type-safe implementation of the CQRS pattern.
 *
 * The CQRS (Command Query Responsibility Segregation) pattern separates read and write operations
 * for a data store, using separate interfaces:
 * - Commands: Change the state of an object
 * - Queries: Return data but do not change state
 *
 * This implementation provides strict typing and decorator-based registration for command and query handlers.
 *
 * @package    @vanguard-nx/cqrs
 * @author     Vanguard Team
 * @copyright  2025 Vanguard Inc.
 * @license    MIT
 */
export * from './command-base';
export * from './command-handler-strict.decorator';
export * from './cq-base';
export * from './cqrs.mediator';
export * from './not-command-or-query.exception';
export * from './query-base';
export * from './query-handler-strict.decorator';
