import { v4 as uuidV4 } from 'uuid';

import PartnerRepository from '../partner.repository';
import PartnerService from '../partner.service';
import { givePartner } from '../../shared/mocks';
import Partner from '../partner.entity';

let repository: PartnerRepository;
let service: PartnerService;
let partnerData: any;

beforeEach(() => {
  partnerData = givePartner();

  repository = {
    upsert: jest.fn(),
    findById: jest.fn(),
    findClosestPartnerThatIncludesLocation: jest.fn(),
  };

  service = new PartnerService(repository);
});

describe('Upsert', () => {
  it('given a valid partner service should call upsert from repository', async () => {
    const partner = new Partner(partnerData);
    await service.upsert(partner);

    expect(repository.upsert).toHaveBeenCalledWith(partner);
  });

  it('given a valid partner data should return a instance of Partner', async () => {
    const partner = new Partner(partnerData);
    repository.upsert = jest.fn().mockReturnValue(partner);

    const upsertedPartner = await service.upsert(partner);
    expect(upsertedPartner).toBeInstanceOf(Partner);
  });
});

describe('FindById', () => {
  it('given a partner id service should call findById from repository', async () => {
    const partnerId = uuidV4();
    await service.findById(partnerId);

    expect(repository.findById).toHaveBeenCalledWith(partnerId);
  });

  it('given a partner id that not exists findById should return undefined', async () => {
    const partnerId = uuidV4();
    repository.findById = jest.fn().mockReturnValue(undefined);

    const upsertedPartner = await service.findById(partnerId);
    expect(upsertedPartner).toBe(undefined);
  });

  it('given a partner id that exists findById should return a Partner', async () => {
    const partnerId = uuidV4();
    const partner = new Partner({ ...partnerData, id: partnerId });
    repository.findById = jest.fn().mockReturnValue(partner);

    const upsertedPartner = await service.findById(partnerId);
    expect(upsertedPartner).toBe(partner);
  });
});

describe('findClosestPartnerThatIncludesLocation', () => {
  it('given a long and lat coordinates service should call findClosestPartnerThatIncludesLocation from repository', async () => {
    await service.findClosestPartnerThatIncludesLocation(
      -49.2774992,
      -25.42731,
    );
    expect(
      repository.findClosestPartnerThatIncludesLocation,
    ).toHaveBeenCalledWith(-49.2774992, -25.42731);
  });

  it('given a long and lat coordinates should return closest partner that coverage area includes the location', async () => {
    const partnerId = uuidV4();
    const partner = new Partner({ ...partnerData, id: partnerId });

    repository.findClosestPartnerThatIncludesLocation = jest
      .fn()
      .mockReturnValue(partner);
    const closestPartner = await service.findClosestPartnerThatIncludesLocation(
      -49.2774992,
      -25.42731,
    );
    expect(closestPartner).toBe(partner);
  });

  it('given a long and lat from a out of coverage location should return undefined', async () => {
    const closestPartner = await service.findClosestPartnerThatIncludesLocation(
      -53.0842532,
      -25.7501234,
    );
    expect(closestPartner).toBe(undefined);
  });
});
