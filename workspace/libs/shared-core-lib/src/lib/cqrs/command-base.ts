import type { ICommand } from '@nestjs/cqrs';
import { CQBase } from './cq-base';

export abstract class CommandBase extends CQBase implements ICommand {}
