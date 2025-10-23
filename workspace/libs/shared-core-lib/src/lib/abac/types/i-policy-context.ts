import { IAbacActor } from './i-abac-actor';

export interface IPolicyContext<
  TActor extends IAbacActor = IAbacActor,
  TResource extends string = string,
  TAction extends string = string,
  TRecord extends Record<string, any> = Record<string, any>,
  TMetadata extends Record<string, any> = Record<string, any>,
> {
  actor: TActor;
  resource: TResource;
  action: TAction;
  record?: TRecord;
  metadata?: TMetadata;
  timestamp: number;
}
