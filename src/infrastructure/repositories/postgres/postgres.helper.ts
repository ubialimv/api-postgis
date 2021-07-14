import { createConnection, Connection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import DatabaseInterface from '../../database/database';
import env from '../../../shared/environments';

const config: PostgresConnectionOptions = {
  database: env.TYPE_ORM_DATABASE,
  host: env.TYPE_ORM_HOST,
  port: env.TYPE_ORM_PORT,
  password: env.TYPE_ORM_PASSWORD,
  username: env.TYPE_ORM_USERNAME,
  type: 'postgres',
  synchronize: env.TYPE_ORM_SYNCHRONIZE,
  logging: env.TYPE_ORM_LOGGING,
  entities: [
    'src/infrastructure/repositories/models/**/*.ts',
    'dist/src/infrastructure/repositories/models/**/*.js',
  ],
};

export default class PostgresHelper implements DatabaseInterface {
  private conn: Connection | undefined;

  public async start() {
    try {
      if (this.conn === undefined) {
        this.conn = await createConnection(config);
        console.log('Connection established - Postgres');
      }
    } catch (error) {
      console.error('Connection failed - Postgres:', error.message);
    }
  }

  public async close() {
    await this.conn?.close();
    console.log('Connection closed - Postgres');
  }
}
