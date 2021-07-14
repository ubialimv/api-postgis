import { json, urlencoded } from 'express';
import request from 'supertest';
import { Server } from 'http';
import { v4 as uuidV4 } from 'uuid';

import App from '../../app';
import PartnerController from '../partner.controller';
import { PartnerServiceInterface } from '../../../domain/partner.service';
import { givePartner } from '../../../shared/mocks';
import Partner from '../../../domain/partner.entity';
import { OpenApiValidatorMiddleware } from '../../middlewares/openApi.middleware';
import errorHandler from '../../middlewares/errorHandler.middleware';

const PartnerServiceMock = jest.fn<PartnerServiceInterface, []>();
const partnerService = new PartnerServiceMock();

const app = new App({
  port: 3000,
  middleWares: [
    json(),
    urlencoded({ extended: true }),
    OpenApiValidatorMiddleware,
    errorHandler,
  ],
  controllers: [new PartnerController(partnerService)],
});

let server: Server;

beforeAll(() => {
  server = app.listen();
});

beforeEach(() => {
  partnerService.upsert = jest.fn();
  partnerService.findById = jest.fn();
  partnerService.findClosestPartnerThatIncludesLocation = jest.fn();
});

afterAll(() => {
  server.close();
});

describe('POST /partners', () => {
  it('given a valid body should call upsert from service and return a created/upserted partner', (done) => {
    const body = givePartner();
    const partner = new Partner(body);

    partnerService.upsert = jest.fn().mockReturnValue(partner);

    request(server)
      .post('/partners')
      .send(body)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((result) => {
        expect(partnerService.upsert).toHaveBeenCalled();

        expect(result.status).toBe(200);
        expect(result.body.id).toBe(partner.id);
        expect(result.body.tradingName).toBe(partner.tradingName);
        expect(result.body.ownerName).toBe(partner.ownerName);
        expect(result.body.document).toBe(partner.document);
        expect(result.body.coverageArea).toStrictEqual(partner.coverageArea);
        expect(result.body.address).toStrictEqual(partner.address);
        done();
      })
      .catch((err) => done(err));
  });

  it('given a invalid partner data should return 400', (done) => {
    const body: any = givePartner();
    delete body.coverageArea;

    request(server)
      .post('/partners')
      .send(body)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((result) => {
        expect(partnerService.upsert).not.toHaveBeenCalled();
        expect(result.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('given an exception from upsert should return 500', (done) => {
    const body = givePartner();

    partnerService.upsert = jest
      .fn()
      .mockRejectedValue(new Error('acabou o gelo'));

    request(server)
      .post('/partners')
      .send(body)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((result) => {
        expect(partnerService.upsert).toHaveBeenCalled();
        expect(result.status).toBe(500);
        done();
      })
      .catch((err) => {
        expect(err.message).toBe('acabou o gelo');
        done(err);
      });
  });
});

describe('GET /partners/:id', () => {
  it('given a partner id that exists should call findById from service and return a partner', (done) => {
    const partnerId = uuidV4();
    const partner = new Partner({ ...givePartner(), id: partnerId });

    partnerService.findById = jest.fn().mockReturnValue(partner);

    request(server)
      .get(`/partners/${partnerId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((result) => {
        expect(partnerService.findById).toHaveBeenCalledWith(partnerId);

        expect(result.status).toBe(200);
        expect(result.body.id).toBe(partner.id);
        expect(result.body.tradingName).toBe(partner.tradingName);
        expect(result.body.ownerName).toBe(partner.ownerName);
        expect(result.body.document).toBe(partner.document);
        expect(result.body.coverageArea).toStrictEqual(partner.coverageArea);
        expect(result.body.address).toStrictEqual(partner.address);
        done();
      })
      .catch((err) => done(err));
  });

  it('given a partner id that not exists should return 404', (done) => {
    const partnerId = uuidV4();

    partnerService.findById = jest.fn().mockReturnValue(undefined);

    request(server)
      .get(`/partners/${partnerId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((result) => {
        expect(partnerService.findById).toHaveBeenCalledWith(partnerId);

        expect(result.status).toBe(404);
        done();
      })
      .catch((err) => {
        expect(err.message).toBe('not found');
        done(err);
      });
  });

  it('given an exception from findById should return 500', (done) => {
    const partnerId = uuidV4();

    partnerService.findById = jest
      .fn()
      .mockRejectedValue(new Error('acabou a cerveja'));

    request(server)
      .get(`/partners/${partnerId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((result) => {
        expect(partnerService.findById).toHaveBeenCalledWith(partnerId);

        expect(result.status).toBe(500);
        done();
      })
      .catch((err) => {
        expect(err.message).toBe('acabou a cerveja');
        done(err);
      });
  });
});

describe('GET /partners', () => {
  it('given a valid long and lat coordinates should call findClosestPartnerThatIncludesLocation from service and return a partner', (done) => {
    const partnerId = uuidV4();
    const partner = new Partner({ ...givePartner(), id: partnerId });

    partnerService.findClosestPartnerThatIncludesLocation = jest
      .fn()
      .mockReturnValue(partner);

    const query = { long: -49.2774992, lat: -25.42731 };

    request(server)
      .get('/partners')
      .query(query)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((result) => {
        expect(
          partnerService.findClosestPartnerThatIncludesLocation,
        ).toHaveBeenCalledWith(query.long, query.lat);

        expect(result.status).toBe(200);
        expect(result.body.id).toBe(partner.id);
        expect(result.body.tradingName).toBe(partner.tradingName);
        expect(result.body.ownerName).toBe(partner.ownerName);
        expect(result.body.document).toBe(partner.document);
        expect(result.body.coverageArea).toStrictEqual(partner.coverageArea);
        expect(result.body.address).toStrictEqual(partner.address);
        done();
      })
      .catch((err) => done(err));
  });

  it('given a long and lat from a out of coverage location should return 200 and empty object', (done) => {
    partnerService.findClosestPartnerThatIncludesLocation = jest
      .fn()
      .mockReturnValue(undefined);

    const query = { long: -53.0842532, lat: -25.7501234 };

    request(server)
      .get('/partners')
      .query(query)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((result) => {
        expect(
          partnerService.findClosestPartnerThatIncludesLocation,
        ).toHaveBeenCalledWith(query.long, query.lat);

        expect(result.status).toBe(200);
        expect(result.body).toStrictEqual({});
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('given invalid long/lat should return 400', (done) => {
    const query = { long: -53.0842532, lat: 'lat' };

    request(server)
      .get('/partners')
      .query(query)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((result) => {
        expect(
          partnerService.findClosestPartnerThatIncludesLocation,
        ).not.toHaveBeenCalled();

        expect(result.status).toBe(400);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('given an exception from findClosestPartnerThatIncludesLocation should return 500', (done) => {
    const query = { long: -53.0842532, lat: -25.7501234 };
    partnerService.findClosestPartnerThatIncludesLocation = jest
      .fn()
      .mockRejectedValue(new Error('zé já fechou'));

    request(server)
      .get('/partners')
      .query(query)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then((result) => {
        expect(
          partnerService.findClosestPartnerThatIncludesLocation,
        ).toBeCalledWith(query.long, query.lat);

        expect(result.status).toBe(500);
        done();
      })
      .catch((err) => {
        expect(err.message).toBe('zé já fechou');
        done(err);
      });
  });
});
