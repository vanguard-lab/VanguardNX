import { IUserActor } from './i-user-actor';

export const USER_ABAC_SERVICE = 'USER_ABAC_SERVICE';

export interface IUserAbacService {
  buildDummyActor(userId: string): IUserActor;
  canListUsers(actor: IUserActor, userRecord: IRecordIdDummy): Promise<boolean>;
}

// dummy interfaces for record and metadata used in policy condition - mainly for type hinting and autocomplete
export interface IRecordIdDummy {
  testId: string;
}

export interface IMetadataDummy {
  metaField: string;
}
