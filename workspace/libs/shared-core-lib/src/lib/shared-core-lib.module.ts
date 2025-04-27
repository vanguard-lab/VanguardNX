import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CqrsMediator } from './cqrs';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class VanguardNxSharedCoreLibModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: VanguardNxSharedCoreLibModule,
      imports: [CqrsModule],
      providers: [
        CqrsMediator,

      ],
      exports: [
        CqrsMediator,

      ],
    };
  }
}
