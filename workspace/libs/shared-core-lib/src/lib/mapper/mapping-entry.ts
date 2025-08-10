import { Constructor } from './types';
import { IMappingEntry } from './types/i-mapping-entry';

/**
 * Represents a mapping entry between source and target classes.
 */
export class MappingEntry implements IMappingEntry {
  constructor(
    public readonly sourceSymbol: symbol,
    public readonly targetSymbol: symbol,
    public readonly sourceConstructor: Constructor,
    public readonly targetConstructor: Constructor,
  ) {}
}
