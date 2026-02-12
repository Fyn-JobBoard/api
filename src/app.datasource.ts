import { join } from 'node:path';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  applicationName: 'fyn-api',
  database: process.env.DB_DATABASE ?? 'fyn',
  host: process.env.DB_HOST ?? 'localhost',
  port: +(process.env.DB_PORT ?? 5433),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '',
  entities: [join(__dirname, '/**/*.entity.{js,ts}')],
  migrations: [join(__dirname, '../db/migrations/*.{ts,js}')],
});
