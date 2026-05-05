import { Request, Response } from "express";

class HealthController{
  async check(req: Request, res: Response){
   res.status(200).json({ message: "OK" });
  }
}

export { HealthController };