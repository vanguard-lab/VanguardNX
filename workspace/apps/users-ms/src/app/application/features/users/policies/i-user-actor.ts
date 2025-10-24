import { IAbacActor } from '@vanguard-nx/core';

export interface IUserActor extends IAbacActor {
  id: string;
  role?: string;
  name?: string;
}
