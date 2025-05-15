// TODO: WIP - dynamic load envs from .env for local on typeorm migrations
import { config } from 'dotenv';
import * as fs from 'fs';
import { resolve } from 'path';

const configFlagIndex = process.argv.findIndex((arg) => arg === '-d');
if (configFlagIndex !== -1 && configFlagIndex + 1 < process.argv.length) {
  const configPath = resolve(process.cwd(), process.argv[configFlagIndex + 1]);

  const serviceRoot = resolve(configPath, '../../../..');
  console.log({ configPath, serviceRoot });
  const envPath = resolve(serviceRoot, '.env');

  if (fs.existsSync(envPath)) {
    config({ path: envPath });
    console.log(`Loaded .env from: ${envPath}`);
  } else {
    console.warn(`.env not found at: ${envPath}`);
  }
} else {
  console.warn('No -d flag provided. Skipping env loading.');
}
