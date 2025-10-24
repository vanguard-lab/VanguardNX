import { Injectable } from '@nestjs/common';
import { AbacService, EConditionOperator, IPolicy, PolicyBuilder } from '@vanguard-nx/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { EUserAction } from './e-user.action';
import { EUserResource } from './e-user.resource';
import { IUserActor } from './i-user-actor';
import { IMetadataDummy, IRecordIdDummy, IUserAbacService } from './i-users.abac';

@Injectable()
export class UserAbacService extends AbacService<IUserActor, EUserAction, EUserResource> implements IUserAbacService {
  constructor(@InjectPinoLogger(UserAbacService.name) protected readonly logger: PinoLogger) {
    super(logger);
  }

  /**
   * Builds a dummy actor object representing the user performing an action.
   * @param userId The ID of the user.
   * @returns dummy IUserActor with `'user:list'` permission.
   */
  public buildDummyActor(userId: string): IUserActor {
    return {
      id: userId,
      role: 'USER',
      permissions: ['user:list'], // Demo permissions
    };
  }

  /**
   * Checks if the actor can list user records.
   * @param actor The user performing the action.
   * @param userRecord The user record to read (demo: includes testId).
   * @throws
   * @returns True if the actor has permission to list users.
   */
  public async canListUsers(actor: IUserActor, userRecord: IRecordIdDummy): Promise<boolean> {
    return this.for(actor)
      .on<IRecordIdDummy>(EUserResource.User, userRecord)
      .with<IMetadataDummy>({ metaField: 'its-awesome!' }) // Dummy metadata
      .can(EUserAction.List);
  }

  /**
   * Checks if the actor can create a new user.
   * @param actor The user performing the action.
   * @returns True if the actor has permission to create a user.
   */
  public async canCreateNewUser(actor: IUserActor): Promise<boolean> {
    return this.for(actor).on(EUserResource.User).can(EUserAction.Write);
  }

  /**
   * Provides all possible actions for the user domain.
   * @returns An array of all EUserAction values.
   */
  protected override getAllActions(): EUserAction[] {
    return Object.values(EUserAction);
  }

  /**
   * Registers policies to illustrate how conditions can use record fields.
   * @returns An array of policies for the user domain.
   */
  protected override registerPolicies(): Array<IPolicy<IUserActor, EUserResource, EUserAction>> {
    const pb = new PolicyBuilder<IUserActor, EUserResource, EUserAction, IRecordIdDummy, IMetadataDummy>();
    const canListUsers = pb
      .withId('can-list-users')
      .withPermission('user:list')
      .withEffect('allow')
      // dummy condition
      .conditions()
      .add({
        field: '{{record.testId}}', // References the testId fields from IUserActor, IRecordIdDummy, and IMetadataDummy
        operator: EConditionOperator.Eq,
        value: '1',
        transformField: (_value, _context) => {
          // In a real scenario, you might transform the value (e.g., parseInt)
          // Remember that IMetadataDummy in canReadUser() ? that metadata is only accessible here, there is no other use of it
          this.logger.info('Transform called with value:', _value);
          this.logger.info('Metadata:', _context.metadata?.metaField);
          return '1'; // Simple transformation (no real effect here)
        },
      })
      .end()
      .build();

    return [canListUsers];
  }
}
