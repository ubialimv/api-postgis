import express, { Router, Request, Response } from 'express';

import Partner from '../../domain/partner.entity';
import { PartnerServiceInterface } from '../../domain/partner.service';
import BaseController from './base.controller';

export default class PartnerController extends BaseController {
  private router: Router = express.Router();

  constructor(private readonly partnerService: PartnerServiceInterface) {
    super();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/partners/:id', this.findById);
    this.router.post('/partners', this.upsert);
    this.router.get('/partners', this.findClosestPartnerThatIncludesLocation);
  }

  public getRoutes() {
    return this.router;
  }

  upsert = async (req: Request, res: Response) => {
    try {
      const partner = new Partner({ ...req.body });

      const partnerUpserted = await this.partnerService.upsert(partner);

      this.ok(res, partnerUpserted);
    } catch (error) {
      this.serverError(res, error);
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const partnerFound = await this.partnerService.findById(id);

      if (partnerFound === undefined) {
        this.notFound(res);
      }

      this.ok(res, partnerFound);
    } catch (error) {
      this.serverError(res, error);
    }
  };

  findClosestPartnerThatIncludesLocation = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { long, lat } = req.query;

      const closestPartner =
        await this.partnerService.findClosestPartnerThatIncludesLocation(
          Number(long),
          Number(lat),
        );

      this.ok(res, closestPartner || {});
    } catch (error) {
      this.serverError(res, error);
    }
  };
}
