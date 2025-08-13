import { isEmpty, isNil, isString, isObjectLike } from 'lodash';

export const isNilOrEmpty = (value: unknown): value is null | undefined => isNil(value) || ((isObjectLike(value) || isString(value)) && isEmpty(value));
