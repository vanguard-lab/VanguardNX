import { RpcBadRequestException } from '../../exceptions';

export class PropertyKeyExtractionException extends RpcBadRequestException {
  constructor(objectOrError?: string | object, description = 'Failed to extract property key from selector') {
    super(objectOrError, description);
  }
}
