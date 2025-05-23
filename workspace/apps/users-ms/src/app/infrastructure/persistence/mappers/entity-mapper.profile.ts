import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities';
import { User } from '../../../application';

@Injectable()
export class EntityMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  public override get profile(): MappingProfile {
    return (mapper) => {
      this.user(mapper);
    };
  }

  private user(mapper: Mapper): void {
    createMap(mapper, UserEntity, User);
  }
}
