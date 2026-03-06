import { existsSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2).flatMap((v) => v.split(/[:.]+/));
const file_path = path.join(__dirname, ...args) + '.ts';

if (existsSync(file_path)) {
  process.argv[1] = file_path;
  import(file_path).catch(console.error);
}
