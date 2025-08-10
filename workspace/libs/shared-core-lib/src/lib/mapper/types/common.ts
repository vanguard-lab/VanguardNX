export type Dictionary<T> = { [key in keyof T]?: unknown };
export type Constructor<T = any> = new (...args: any[]) => T;
export type ClassIdentifier<T = any> = Constructor<T>;
