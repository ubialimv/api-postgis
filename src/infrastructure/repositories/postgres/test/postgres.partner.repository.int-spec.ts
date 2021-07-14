import { EntityManager, getConnection } from 'typeorm';
import PostgresHelper from '../postgres.helper';
import PostgresPartnerRepository from '../postgres.partner.repository';
import PartnerModel from '../../models/postgres.partner.model';
import Partner from '../../../../domain/partner.entity';
import { givePartner, givePartners } from '../../../../shared/mocks';

const db = new PostgresHelper();
let postgresPartnerRepository: PostgresPartnerRepository;
let entityManager: EntityManager;

const createPartners = async (partners: Partner[]) => {
  const promises = partners.map((partner) =>
    entityManager.save(PartnerModel, PartnerModel.from(partner)),
  );

  const results = await Promise.all(promises);
  return results.map((x) => x.toDomain());
};

beforeAll(async () => {
  await db.start();
  entityManager = new EntityManager(getConnection());
});

beforeEach(async () => {
  postgresPartnerRepository = new PostgresPartnerRepository();
  await entityManager.clear(PartnerModel);
});

afterAll(async () => {
  await db.close();
});

describe('upsert', () => {
  it('given a new partner upsert should return a instanceOf Partner', async () => {
    const partnerCreated = await postgresPartnerRepository.upsert(
      new Partner(givePartner()),
    );

    expect(partnerCreated).toBeInstanceOf(Partner);
  });

  it('given a new partner upsert should create', async () => {
    const partnerCreated = await postgresPartnerRepository.upsert(
      new Partner(givePartner()),
    );

    const partnerFound = await entityManager.findOne(
      PartnerModel,
      partnerCreated.id,
    );

    expect(partnerCreated.id).toBe(partnerFound?.id);
  });

  it('given a existent partner upsert should update', async () => {
    const partner = new Partner(givePartner());

    const [partnerCreated] = await createPartners([partner]);

    await postgresPartnerRepository.upsert({
      ...partnerCreated,
      ownerName: 'ubialimv',
    });

    const partnerFound = await entityManager.findOne(
      PartnerModel,
      partnerCreated.id,
    );

    expect(partnerCreated.id).toBe(partnerFound?.id);
    expect(partnerFound?.ownerName).toBe('ubialimv');
  });
});

describe('findById', () => {
  it('given a partner id that exists findById should return a partner', async () => {
    const data = PartnerModel.from(new Partner(givePartner()));
    const partnerCreated = await entityManager
      .save(PartnerModel, data)
      .then((result) => result.toDomain());

    const partnerFound = await postgresPartnerRepository.findById(
      partnerCreated.id,
    );

    expect(partnerFound).toEqual(partnerCreated);
  });

  it('given a partner id that not exists findById should return undefined', async () => {
    const partnerFound = await postgresPartnerRepository.findById('some-id');

    expect(partnerFound).toBe(undefined);
  });
});

describe('findClosestPartner', () => {
  it('given a long and lat findClosestPartnerThatIncludesLocation should return the closest partner that coverage area includes the location', async () => {
    const partners = givePartners().map((x) => new Partner(x));
    await createPartners(partners);

    const closestPartner =
      await postgresPartnerRepository.findClosestPartnerThatIncludesLocation(
        -49.2774992,
        -25.42731,
      );

    expect(closestPartner).not.toBe(undefined);
  });

  it('given the long and lat from a out of coverage location findClosestPartnerThatIncludesLocation should return undefined', async () => {
    const partners = givePartners().map((x) => new Partner(x));
    await createPartners(partners);

    const closestPartner =
      await postgresPartnerRepository.findClosestPartnerThatIncludesLocation(
        -53.0842532,
        -25.7501234,
      );

    expect(closestPartner).toBe(undefined);
  });
});
