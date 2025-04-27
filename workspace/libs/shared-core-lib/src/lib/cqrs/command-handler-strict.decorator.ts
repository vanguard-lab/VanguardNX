/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                        COMMAND HANDLER DECORATOR                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */
import 'reflect-metadata';
import { COMMAND_HANDLER_METADATA, COMMAND_METADATA } from './constants';
import type { CommandBase } from './command-base';
import { uuid } from '@vanguard-nx/utils';

/** The CommandHandlerStrict decorator is used to mark a class as a handler for a specific command.
 * It uses TypeScript's reflect-metadata to associate the handler with the command it handles.
 *
 * Unlike the standard `CommandHandler` from `@nestjs/cqrs` this implementation enforces
 * strict type checking between the command and its handler.
 *
 *
 * @param command - The command class that this handler will handle
 * @returns A class decorator function
 *
 * @see CommandBase
 * @see COMMAND_HANDLER_METADATA
 * @see COMMAND_METADATA
 */
export const CommandHandlerStrict = (command: CommandBase): ClassDecorator => {
  return (target: object) => {
    if (!Reflect.hasOwnMetadata(COMMAND_METADATA, command)) {
      Reflect.defineMetadata(COMMAND_METADATA, { id: uuid() }, command);
    }
    Reflect.defineMetadata(COMMAND_HANDLER_METADATA, command, target);
  };
};
