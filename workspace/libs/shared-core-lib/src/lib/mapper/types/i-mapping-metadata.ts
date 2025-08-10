import { Constructor } from './common';

export interface IMappingMetadata {
  propertyKey: string;
  type?: Constructor | Constructor[];
  sourceType?: Constructor | Constructor[];
  targetType?: Constructor | Constructor[];
}
