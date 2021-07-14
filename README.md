## Node Api with TypeScript using PostGIS

### Description

This api is responsible for the partners. It was built using Express.js, TypeScript, Postgres with [PostGIS](https://postgis.net/docs/), [TypeORM](https://typeorm.io/) and Jest for tests.

Pay attention to the boundaries rules settled in eslint, the structure is not DDD by the book, but I was taken into consideration.

The api is Contract-First, so it's using a middleware that reads the routes documentation and validate each route accordingly to it. This middleware validates request and response, so any new route or any change, must start with the documentation.

The documentation is a [Swagger](https://swagger.io/resources/open-api/) file and can be found at `contracts` folder after you start de api you may see it accessing /docs.

### Dependencies

To install the projects dependencies, run the following command:

```bash
$ yarn
```

### Running the application

As it was mentioned this api is using Postgres with [PostGIS](https://postgis.net/docs/), but all you need to do is run the database from the docker-compose.yml:

```bash
$ docker-compose up pg_postgis
```

After that, copy and past `environments/.env.local` and rename it to `environments/.env`.

All done? run:

```bash
# development
$ npm run start
```

### Testing

The tests setup are located in the `jest` folder, and they are using a different env file: `environments/.env.test`. Each test has a configuration file, so it's worth to mention:

#### Unit test

Unit test files must follow the example: `myfile.spec.ts`. The coverage report may be found at coverage/unit.

#### Integration test

Integration test files must follow the example: `myfile.int-spec.ts`. The coverage report may be found at coverage/int. These tests are using a real database, so you'll need I recommend to use a different database from the application, so you can run:

```bash
$ docker-compose up pg_postgis_test
```

### Env vars

- PORT: Port the api is going to use. (default 3000);

If you are using the database from the docker file I don't recommend changing the following vars:

- TYPE_ORM_DATABASE: Database name;
- TYPE_ORM_HOST: Database host;
- TYPE_ORM_PORT: Database port;
- TYPE_ORM_PASSWORD: Database user password;
- TYPE_ORM_USERNAME: Database user;
- TYPE_ORM_SYNCHRONIZE: When true it'll sync your entities with the database, every time you run the application. Be careful when using in production;
- TYPE_ORM_LOGGING: When true it'll log any communication with the database.
