import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

const flag = '-d';
const flagIndex = process.argv.indexOf(flag);

if (flagIndex >= 0 && flagIndex + 1 < process.argv.length) {
  const targetDir = resolve(process.cwd(), process.argv[flagIndex + 1]);
  const envFile = resolve(targetDir, '../../../../..', '.env');

  if (existsSync(envFile)) {
    config({ path: envFile });
    console.log(`Loaded .env from: ${envFile}`);
  } else {
    console.warn(`.env file not found at: ${envFile}`);
  }
} else {
  console.warn(`Missing "${flag}" flag. Skipping environment loading.`);
}
