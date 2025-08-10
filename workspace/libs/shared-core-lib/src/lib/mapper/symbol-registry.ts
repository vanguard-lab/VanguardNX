import { Constructor } from './types';
import { Logger } from './logger';

/**
 * Manages bidirectional mapping between constructors and unique symbols.
 */
export class SymbolRegistry {
  private readonly classToSymbol = new Map<Constructor, symbol>();

  private readonly symbolToClass = new Map<symbol, Constructor>();

  /**
   * Gets or creates a unique Symbol for a constructor.
   * @template T
   * @param {Constructor<T>} constructor - Constructor to get symbol for
   * @returns {symbol} Unique symbol for the constructor
   */
  public getSymbol<T>(constructor: Constructor<T>): symbol {
    let symbol = this.classToSymbol.get(constructor);
    if (!symbol) {
      symbol = Symbol(constructor.name); // Create only once
      this.classToSymbol.set(constructor, symbol);
      this.symbolToClass.set(symbol, constructor);
      Logger.log(`[SymbolRegistry] Created symbol for ${constructor.name}: ${symbol.toString()}`);
    }
    return symbol;
  }

  /**
   * Finds the constructor for a given Symbol.
   * @param {symbol} symbol - Symbol to find constructor for
   * @returns {Constructor|undefined} Constructor or undefined if not found
   */
  public getConstructor(symbol: symbol): Constructor | undefined {
    return this.symbolToClass.get(symbol);
  }

  /**
   * Finds the Symbol for a given constructor.
   * @param {Constructor} constructor - Constructor to find symbol for
   * @returns {symbol|undefined} Symbol or undefined if not found
   */
  public findSymbol(constructor: Constructor): symbol | undefined {
    return this.classToSymbol.get(constructor);
  }

  /**
   * Outputs debug information about symbol mappings.
   */
  public debug(): void {
    Logger.log(
      '[SymbolRegistry] Symbols:',
      Array.from(this.classToSymbol, ([ctor, sym]) => `${ctor.name} -> ${sym.toString()}`),
    );
  }
}
