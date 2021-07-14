import { Router, Response } from 'express';

export default abstract class BaseController {
  protected abstract registerRoutes(): void;

  abstract getRoutes(): Router;

  public static jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message });
  }

  public ok<T>(res: Response, data: T) {
    return res.status(200).json(data);
  }

  public notFound(res: Response, message?: string) {
    return BaseController.jsonResponse(res, 404, message || 'Not found');
  }

  public serverError(res: Response, error: Error | string) {
    console.log(error);
    return res.status(500).json({
      message: error.toString(),
    });
  }
}
