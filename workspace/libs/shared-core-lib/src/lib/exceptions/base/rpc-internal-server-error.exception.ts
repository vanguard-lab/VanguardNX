import { HttpStatus } from '@nestjs/common';
import { RpcBaseException } from './rpc-base.exception';

export class RpcInternalServerErrorException extends RpcBaseException {
  constructor(objectOrError?: string | object, description = 'Internal Server Error') {
    super(RpcBaseException.createPayload(objectOrError, description, HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
