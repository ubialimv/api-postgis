import Partner from './partner.entity';

export default interface PartnerRepository {
  upsert(partner: Partner): Promise<Partner>;
  findById(id: string): Promise<Partner | undefined>;
  findClosestPartnerThatIncludesLocation(
    long: number,
    lat: number,
  ): Promise<Partner | undefined>;
}
