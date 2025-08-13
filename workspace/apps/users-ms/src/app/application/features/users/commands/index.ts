export * from './add';
export * from './edit';

import { AddUserCommandHandler } from './add';
import { EditUserCommandHandler } from './edit';

export default [AddUserCommandHandler, EditUserCommandHandler];
