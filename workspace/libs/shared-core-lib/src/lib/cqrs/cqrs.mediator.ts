/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                           CQRS MEDIATOR                                     │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 */
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CommandBase } from './command-base';
import { CQBase } from './cq-base';
import { NotCommandOrQueryException } from './not-command-or-query.exception';
import { QueryBase } from './query-base';

/** The CqrsMediator provides a unified interface for executing both commands and queries.
 * It delegates to the appropriate bus based on the type of the input object.
 *
 * This implementation of the Mediator pattern simplifies client code by removing the need
 * to determine whether to use the command bus or query bus.
 *
 * @throws {NotCommandOrQueryException} When the provided object is neither a Command nor a Query
 *
 * @see CommandBase
 * @see QueryBase
 * @see CQBase
 * @see NotCommandOrQueryException
 */
@Injectable()
export class CqrsMediator {
  constructor(
    protected readonly queryBus: QueryBus,
    protected readonly commandBus: CommandBus
  ) {}

  public async execute<T extends CQBase, TRes = any>(cq: T): Promise<TRes> {
    if (cq instanceof QueryBase) {
      return await this.queryBus.execute<T, TRes>(cq);
    }
    if (cq instanceof CommandBase) {
      return await this.commandBus.execute<T, TRes>(cq);
    }
    throw new NotCommandOrQueryException(cq);
  }
}
