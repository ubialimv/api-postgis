import 'reflect-metadata';
import { json, urlencoded } from 'express';

import App from './application/app';
import { makeDatabase, makePartnerController } from './shared/factory';
import {
  OpenApiValidatorMiddleware,
  OPEN_API_SPEC_FILE_LOCATION,
} from './application/middlewares/openApi.middleware';
import errorHandler from './application/middlewares/errorHandler.middleware';
import env from './shared/environments';

const db = makeDatabase();
const controllers = [makePartnerController()];
const app = new App({
  port: env.PORT,
  middleWares: [
    json(),
    urlencoded({ extended: true }),
    OpenApiValidatorMiddleware,
    errorHandler,
  ],
  controllers,
  spec: OPEN_API_SPEC_FILE_LOCATION,
});

(async () => {
  await db.start();
  app.listen();
})();
