import { ObjectMapperModuleOptions } from './i-object-mapper-module-options';

export interface ObjectMapperModuleAsyncOptions {
  imports?: any[];
  inject?: any[];
  useFactory: (...args: any[]) => Promise<ObjectMapperModuleOptions> | ObjectMapperModuleOptions;
}
