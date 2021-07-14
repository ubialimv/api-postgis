import { v4 as uuidV4 } from 'uuid';
import { MultiPolygon, Point } from 'geojson';

export default class Partner {
  readonly id: string;

  readonly tradingName: string;

  readonly ownerName: string;

  readonly document: string;

  readonly coverageArea: MultiPolygon;

  readonly address: Point;

  constructor(props: {
    id?: string;
    tradingName: string;
    ownerName: string;
    document: string;
    coverageArea: { type: any; coordinates: number[][][][] };
    address: { type: any; coordinates: number[] };
  }) {
    this.id = props.id || uuidV4();
    this.tradingName = props.tradingName;
    this.ownerName = props.ownerName;
    this.document = props.document;
    this.coverageArea = props.coverageArea;
    this.address = props.address;
  }
}
