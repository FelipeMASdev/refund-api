import { Request, Response } from "express";

class RefundsController {
  async create(req: Request, res: Response) {
    return res.status(200).json({ message: "Refunds controller OK" });
  }
}

export { RefundsController };