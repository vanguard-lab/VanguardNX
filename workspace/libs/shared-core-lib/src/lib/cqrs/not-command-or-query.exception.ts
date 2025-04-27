import { RpcBadRequestException } from "../exceptions";

export class NotCommandOrQueryException extends RpcBadRequestException {
  constructor(objectOrError?: string | object, description = "Not a Command or Query") {
    super(objectOrError, description);
  }
}