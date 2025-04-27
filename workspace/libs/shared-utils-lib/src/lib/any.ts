import { isEmpty, isNil, isString, isObjectLike } from 'lodash';

export const isNilOrEmpty = (value: unknown): boolean =>
  isNil(value) || ((isObjectLike(value) || isString(value)) && isEmpty(value));
