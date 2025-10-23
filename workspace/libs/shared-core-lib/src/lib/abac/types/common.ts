import { IAbacActor } from './i-abac-actor';

export type IPermission<TResource extends string = string, TAction extends string = string> =
  | `${TResource}:${TAction | '*'}` // e.g., "user:read" or "user:*"
  | '*:*';

export type FieldTemplate<TActor extends IAbacActor, TRecord extends Record<string, any>, TMetadata extends Record<string, any>> =
  | `{{actor.${Extract<keyof TActor, string | number | bigint>}}}` // TODO: should i omit some keys?
  | `{{record.${Extract<keyof TRecord, string | number | bigint>}}}`
  | `{{metadata.${Extract<keyof TMetadata, string | number | bigint>}}}`;
