import { IReadOnlyRepo } from './i-read-only.repo';

export interface IBaseRepo<T, TKey> extends IReadOnlyRepo<T, TKey> {
  createAsync(entry: T): Promise<T>;
  updateAsync(entry: T): Promise<T>;
}
