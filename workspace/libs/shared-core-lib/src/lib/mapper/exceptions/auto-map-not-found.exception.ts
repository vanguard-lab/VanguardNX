import { RpcNotFoundException } from '../../exceptions';

export class AutoMapNotFoundException extends RpcNotFoundException {
  constructor(objectOrError: string | object, description = 'Not Found') {
    super(objectOrError, description);
  }
}
