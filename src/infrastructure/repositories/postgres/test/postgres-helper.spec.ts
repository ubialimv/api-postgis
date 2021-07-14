import * as typeorm from 'typeorm';
import PostgresHelper from '../postgres.helper';

let postgresHelper: PostgresHelper;

beforeEach(() => {
  jest.resetAllMocks();
  postgresHelper = new PostgresHelper();
});

describe('Postgres Helper', () => {
  it('given a exception when starting database Postgres Helper should catch it', async () => {
    jest
      .spyOn(typeorm, 'createConnection')
      .mockReturnValue(Promise.reject(new Error('wrong password')));

    try {
      await postgresHelper.start();
    } catch (error) {
      expect(error.message).toBe('wrong password');
    }
  });
});
