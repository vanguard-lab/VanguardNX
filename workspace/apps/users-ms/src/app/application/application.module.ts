import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers, Controllers, CustomMappings, MappingProfiles, QueryHandlers } from './features';
import { ObjectMapperModule } from '@vanguard-nx/core';

@Module({})
export class ApplicationModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: ApplicationModule,
      imports: [CqrsModule, ObjectMapperModule],
      controllers: [...Controllers],
      providers: [...QueryHandlers, ...CommandHandlers, ...MappingProfiles, ...CustomMappings],
    };
  }
}
