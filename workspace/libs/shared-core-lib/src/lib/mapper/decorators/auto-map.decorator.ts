import { Inject } from '@nestjs/common';
import { MetadataStore } from '../metadata-store';
import { Constructor } from '../types';

export const VANGUARD_TRANSMUTE = Symbol('VANGUARD_TRANSMUTE');

export function AutoMap(type?: () => Constructor | Constructor[]): PropertyDecorator {
  return (target: unknown, propertyKey: string): void => {
    MetadataStore.addField(target!.constructor as Constructor, propertyKey, type?.());
  };
}

export const InjectMapper = (): PropertyDecorator & ParameterDecorator => Inject(VANGUARD_TRANSMUTE);
