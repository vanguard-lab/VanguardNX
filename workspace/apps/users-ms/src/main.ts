import type { INestApplication } from '@nestjs/common';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RpcGlobalExceptionInterceptor } from '@vanguard-nx/core';
import { EMPTY_STR } from '@vanguard-nx/utils';
import * as bodyParser from 'body-parser';
import { Logger } from 'nestjs-pino';
import { IApiOptions, IUsersMsConfig } from './app/configuration';
import { UsersModule } from './app/user.module';

const PKG_VERSION = process.env?.npm_package_version ?? '1.0';
const PKG_NAME = process.env?.npm_package_name ?? 'api-bootstrap';
const GLOBAL_VERSION = '1';

async function bootstrap(): Promise<void> {
  const context = await NestFactory.createApplicationContext(UsersModule.forRoot(), { bufferLogs: true });
  const logger = context.get<Logger>(Logger);
  const config = context.get<ConfigService<IUsersMsConfig>>(ConfigService);
  const apiConfig = config.get<IApiOptions>('api')!;

  await context.close();

  const app = await NestFactory.create(UsersModule.forRoot());

  app.setGlobalPrefix(apiConfig.globalPrefix, {
    exclude: [{ path: EMPTY_STR, method: RequestMethod.GET, version: EMPTY_STR }],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: GLOBAL_VERSION,
  });

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new RpcGlobalExceptionInterceptor());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  addSwagger(app, apiConfig.globalPrefix);

  await app.startAllMicroservices();
  logger.log(`Microservice started`);

  await app.listen(apiConfig.port);
  logger.log(`Application is running on: http://${apiConfig.host}:${apiConfig.port}/${apiConfig.globalPrefix}/v${GLOBAL_VERSION}`);
  logger.log(`Global URL: ${apiConfig.domain}/${apiConfig.globalPrefix}/v${GLOBAL_VERSION}`);
  logger.log(`Documentation URL: ${apiConfig.domain}/${apiConfig.globalPrefix}/docs`);
}

function addSwagger(app: INestApplication, globalPrefix: string): void {
  const swagger = new DocumentBuilder().setTitle(`Users MS`).setDescription(`${PKG_NAME.toLocaleUpperCase()} Documentation`).setVersion(PKG_VERSION).build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);
}

void bootstrap();
