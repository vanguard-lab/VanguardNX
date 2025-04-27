import { isObject } from '@vanguard-nx/utils';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { RpcBaseException } from '../exceptions';

@Injectable()
export class RpcGlobalExceptionInterceptor implements NestInterceptor {
  public intercept(
    _context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (
          isObject(error) &&
          // @ts-ignore
          error?.isRpc &&
          !(error instanceof HttpException)
        ) {
          // @ts-ignore
          throw new HttpException(error.payload, error.status);
        }
        if (error instanceof RpcBaseException) {
          throw new HttpException(error.getPayload(), error.getStatus());
        }
        throw error;
      })
    );
  }
}
