import { RpcException } from '@nestjs/microservices';
import { isArray, isObject } from '@vanguard-nx/utils';

export class RpcBaseException extends RpcException {
  public readonly payload: string | Record<string, unknown>;

  public readonly status: number;

  public readonly type: string;

  public readonly isRpc = true;

  constructor(payload: string | Record<string, any>, status: number, errorType?: string) {
    super(payload);
    this.payload = payload;
    this.status = status;
    this.type = errorType ?? this.constructor.name;
  }

  public getStatus(): number {
    return this.status;
  }

  public getPayload(): string | Record<string, unknown> {
    return this.payload;
  }

  public getType(): string {
    return this.type;
  }

  public override getError(): string | object {
    return {
      isRpc: true,
      type: this.type,
      status: this.status,
      payload: this.payload,
    };
  }

  public static createPayload(objectOrError?: object | string, description?: string, statusCode?: number): object {
    if (!objectOrError) {
      return { statusCode, message: description };
    }

    return isObject(objectOrError) && !isArray(objectOrError) ? objectOrError : { statusCode, message: objectOrError, error: description };
  }
}
