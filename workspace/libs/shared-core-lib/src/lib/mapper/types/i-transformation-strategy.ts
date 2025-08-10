import { Constructor } from './common';

export interface ITransformationStrategy {
  customFields: Map<string, (source: any) => any>;
  nestedArrayFields: Array<{ fieldName: string; elementType: Constructor }>;
  nestedObjectFields: Array<{ fieldName: string; targetType: Constructor }>;
  directCopyFields: string[];
}
