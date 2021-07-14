import { Entity, PrimaryColumn, Column, Index } from 'typeorm';
import { MultiPolygon, Point } from 'geojson';

import Partner from '../../../domain/partner.entity';

@Entity('partners')
class PartnerModel {
  @PrimaryColumn()
  readonly id: string;

  @Column({
    name: 'trading_name',
  })
  readonly tradingName: string;

  @Column({
    name: 'owner_name',
  })
  readonly ownerName: string;

  @Index({ unique: true })
  @Column()
  readonly document: string;

  @Column({
    name: 'coverage_area',
    type: 'geometry',
    spatialFeatureType: 'MultiPolygon',
  })
  readonly coverageArea: MultiPolygon;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
  })
  readonly address: Point;

  constructor(
    id: string,
    tradingName: string,
    ownerName: string,
    document: string,
    coverageArea: MultiPolygon,
    address: Point,
  ) {
    this.id = id;
    this.tradingName = tradingName;
    this.ownerName = ownerName;
    this.document = document;
    this.coverageArea = coverageArea;
    this.address = address;
  }

  static from(domain: Partner): PartnerModel {
    return new PartnerModel(
      domain.id,
      domain.tradingName,
      domain.ownerName,
      domain.document,
      domain.coverageArea,
      domain.address,
    );
  }

  toDomain(): Partner {
    return new Partner({
      id: this.id,
      tradingName: this.tradingName,
      ownerName: this.ownerName,
      document: this.document,
      coverageArea: this.coverageArea,
      address: this.address,
    });
  }
}

export default PartnerModel;
