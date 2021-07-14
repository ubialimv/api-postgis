import PostgresPartnerRepository from '../infrastructure/repositories/postgres/postgres.partner.repository';
import PartnerService from '../domain/partner.service';
import PartnerController from '../application/controllers/partner.controller';
import DatabaseInterface from '../infrastructure/database/database';
import PostgresHelper from '../infrastructure/repositories/postgres/postgres.helper';

const makePartnerService = (): PartnerService =>
  new PartnerService(new PostgresPartnerRepository());

const makePartnerController = (): PartnerController =>
  new PartnerController(makePartnerService());

const makeDatabase = (): DatabaseInterface => new PostgresHelper();

export { makePartnerService, makePartnerController, makeDatabase };
