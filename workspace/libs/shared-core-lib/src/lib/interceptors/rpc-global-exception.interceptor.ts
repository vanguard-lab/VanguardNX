import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { isObject } from '@vanguard-nx/utils';
import { catchError, Observable } from 'rxjs';
import { RpcBaseException } from '../exceptions';

@Injectable()
export class RpcGlobalExceptionInterceptor implements NestInterceptor {
  public intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (
          isObject(error) &&
          // @ts-expect-error: 'isRpc' is a dynamic runtime-only property, not a part of typings.
          error?.isRpc &&
          !(error instanceof HttpException)
        ) {
          // @ts-expect-error: 'payload' and 'status' are runtime properties on RPC error objects; not statically typed.
          throw new HttpException(error.payload, error.status);
        }

        if (error instanceof RpcBaseException) {
          throw new HttpException(error.getPayload(), error.getStatus());
        }

        throw error;
      }),
    );
  }
}
