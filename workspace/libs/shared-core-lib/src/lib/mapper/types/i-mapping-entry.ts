import { Constructor } from './common';

export interface IMappingEntry {
  /**
   * Symbol representing the source class.
   */
  readonly sourceSymbol: symbol;

  /**
   * Symbol representing the target class.
   */
  readonly targetSymbol: symbol;

  /**
   * Constructor for the source class.
   */
  readonly sourceConstructor: Constructor;

  /**
   * Constructor for the target class.
   */
  readonly targetConstructor: Constructor;
}
