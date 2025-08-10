import { RpcBadRequestException } from '../../exceptions';

export class InvalidArrayInputException extends RpcBadRequestException {
  constructor(objectOrError?: string | object, description = 'Invalid input: expected an array of sources') {
    super(objectOrError, description);
  }
}
