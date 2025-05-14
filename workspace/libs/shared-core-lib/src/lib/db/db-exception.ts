import { RpcInternalServerErrorException } from '../exceptions';

export class DbException extends RpcInternalServerErrorException {
  constructor(objectOrError?: string | object, description = 'Database Error') {
    // TODO: need testing if this works as expected. Don't need to display all tables info on response.
    super(typeof objectOrError !== 'object' ? objectOrError : objectOrError['message'], description);
  }
}
