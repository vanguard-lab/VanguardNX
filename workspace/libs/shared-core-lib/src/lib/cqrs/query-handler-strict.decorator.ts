/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                         QUERY HANDLER DECORATOR                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 */
import { uuid } from '@vanguard-nx/utils';
import 'reflect-metadata';
import { QUERY_HANDLER_METADATA, QUERY_METADATA } from './constants';
import type { QueryBase } from './query-base';

/** The QueryHandlerStrict decorator is used to mark a class as a handler for a specific query.
 * It uses TypeScript's reflect-metadata to associate the handler with the query it handles.
 *
 * Unlike the standard `QueryHandler` from `@nestjs/cqrs`, this implementation enforces
 * strict type checking between the query and its handler.
 *
 *
 * @param query - The query class that this handler will handle
 * @returns A class decorator function
 *
 * @see QueryBase
 * @see QUERY_HANDLER_METADATA
 * @see QUERY_METADATA
 */

export const QueryHandlerStrict = (query: QueryBase): ClassDecorator => {
  return (target: object) => {
    if (!Reflect.hasOwnMetadata(QUERY_METADATA, query)) {
      Reflect.defineMetadata(QUERY_METADATA, { id: uuid() }, query);
    }
    Reflect.defineMetadata(QUERY_HANDLER_METADATA, query, target);
  };
};
