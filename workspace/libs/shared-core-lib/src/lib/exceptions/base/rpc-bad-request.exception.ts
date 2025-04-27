import { HttpStatus } from "@nestjs/common";
import { RpcBaseException } from "./rpc-base.exception";

export class RpcBadRequestException extends RpcBaseException {
  constructor(objectOrError?: string | object, description = "Bad Request") {
    super(RpcBaseException.createPayload(objectOrError, description, HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
  }
}
