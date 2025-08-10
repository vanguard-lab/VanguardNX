import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers, Controllers, MappingProfiles, QueryHandlers } from './features';

@Module({})
export class ApplicationModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: ApplicationModule,
      imports: [CqrsModule],
      controllers: [...Controllers],
      providers: [...QueryHandlers, ...CommandHandlers, ...MappingProfiles],
    };
  }
}
