import { Request, Response } from 'express';
import * as service from './service';

export async function deployContract(req: Request, res: Response) {
  try {
    const data = await service.deployContract(req.body);
    return res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllContract(req: Request, res: Response) {
  try {
    const data = await service.getAllContract();
    return res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getFaucet(req: Request, res: Response) {
  try {
    const data = await service.getFaucet(req.body);
    return res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
