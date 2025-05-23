import { HttpStatus } from "@nestjs/common";
import { RpcBaseException } from "./rpc-base.exception";

export class RpcNotFoundException extends RpcBaseException {
  constructor(objectOrError?: string | object, description = "Not Found") {
    super(RpcBaseException.createPayload(objectOrError, description, HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND);
  }
}
