import { getConnection } from 'typeorm';

import Partner from '../../../domain/partner.entity';
import PartnerRepository from '../../../domain/partner.repository';
import PartnerModel from '../models/postgres.partner.model';

export default class PostgresPartnerRepository implements PartnerRepository {
  public async upsert(partner: Partner): Promise<Partner> {
    const data = PartnerModel.from(partner);

    const partnerUpserted = await getConnection()
      .getRepository(PartnerModel)
      .save(data);

    return partnerUpserted.toDomain();
  }

  public async findById(id: string): Promise<Partner | undefined> {
    const partnerFound = await getConnection()
      .getRepository(PartnerModel)
      .findOne(id);

    if (partnerFound !== undefined) {
      return partnerFound.toDomain();
    }

    return undefined;
  }

  public async findClosestPartnerThatIncludesLocation(
    long: number,
    lat: number,
  ): Promise<Partner | undefined> {
    const where = `
      ST_Within(
        'SRID=4326;POINT(${long} ${lat})'::geometry,
        partner.coverage_area
      ) = true
    `;

    const orderBy = `
      ST_Distance(
        'SRID=4326;POINT(${long} ${lat})'::geometry,
        partner.address
      )
    `;

    const closestPartner = await getConnection()
      .getRepository(PartnerModel)
      .createQueryBuilder('partner')
      .where(where)
      .orderBy(orderBy, 'ASC')
      .getOne();

    if (closestPartner !== undefined) {
      return closestPartner.toDomain();
    }

    return undefined;
  }
}
