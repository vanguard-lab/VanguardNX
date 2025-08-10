import { RpcBadRequestException } from '../../exceptions';

export class InvalidConstructorException extends RpcBadRequestException {
  constructor(objectOrError?: string | object, description = 'Invalid class identifier, expected a constructor function') {
    super(objectOrError, description);
  }
}
