import { RpcInternalServerErrorException } from './rpc-internal-server-error.exception';

export class ArgumentNilException extends RpcInternalServerErrorException {
  constructor(objectOrError?: string | object, description = 'Argument Nil Exception') {
    super(objectOrError, description);
  }
}
