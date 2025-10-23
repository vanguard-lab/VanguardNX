import { ICondition } from './i-condition';

export interface IScope {
  type: 'global' | 'organization' | 'department' | 'team' | 'project' | 'personal';
  values?: string[];
  conditions?: ICondition[];
}
