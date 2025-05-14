export interface IReadOnlyRepo<T, TKey> {
  getAsync(pk: TKey): Promise<T | null>;
}
