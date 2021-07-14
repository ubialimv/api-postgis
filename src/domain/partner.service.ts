import Partner from './partner.entity';
import PartnerRepository from './partner.repository';

export interface PartnerServiceInterface {
  upsert(partner: Partner): Promise<Partner>;
  findById(id: string): Promise<Partner | undefined>;
  findClosestPartnerThatIncludesLocation(
    long: number,
    lat: number,
  ): Promise<Partner | undefined>;
}

export default class PartnerService {
  constructor(private readonly partnerRepository: PartnerRepository) {}

  async upsert(partner: Partner): Promise<Partner> {
    return this.partnerRepository.upsert(partner);
  }

  async findById(id: string): Promise<Partner | undefined> {
    return this.partnerRepository.findById(id);
  }

  async findClosestPartnerThatIncludesLocation(
    long: number,
    lat: number,
  ): Promise<Partner | undefined> {
    return this.partnerRepository.findClosestPartnerThatIncludesLocation(
      long,
      lat,
    );
  }
}
