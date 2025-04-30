import { isNilOrEmpty } from './any';
import { parseInt as internalParseInt } from 'lodash';

export const parseInt = (value: unknown, radix?: number): number | null => (!isNilOrEmpty(value) ? internalParseInt(value as string, radix) : null);
