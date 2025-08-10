import { Injectable } from '@nestjs/common';
import { InjectMapper, ITransmute, MapperProfile } from '@vanguard-nx/core';
import { User } from '../../../application';
import { UserEntity } from '../entities';

@Injectable()
export class EntityMapperProfile extends MapperProfile {
  constructor(@InjectMapper() protected readonly mapper: ITransmute) {
    super(mapper);
  }

  public override configure(): void {
    this.user();
  }

  private user(): void {
    this.createMap(UserEntity, User);

    this.mapper.debug();
  }
}
