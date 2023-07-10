import { Request, Response } from 'express';
import * as service from './service';

export async function signUp(req: Request, res: Response) {
  try {
    const data = await service.signUp(req.body);
    res.cookie('token', data, { httpOnly: true });
    return res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function signIn(req: Request, res: Response) {
  try {
    await service.signIn(req.body);
    return res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function verifyOTP(req: Request, res: Response) {
  try {
    const data = await service.verifyOTP(req.body);
    res.cookie('token', data.token, { httpOnly: true });
    return res.status(200).json({ data: data.message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function userInfo(req: Request, res: Response) {
  try {
    const data = await service.userInfo(req.body);
    return res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    req.body.id = req.params;
    const data = await service.updateUser(req.body);
    return res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const payload = { token: req.cookies.token, email: req.body.email };
    const data = await service.logout(payload);
    res.clearCookie('token');
    return res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function generateSignature(req: Request, res: Response) {
  try {
    const data = await service.generateSignature(req.body);
    return res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function signinWithWalletAddress(req: Request, res: Response) {
  try {
    const data = await service.signinWithWalletAddress(req.body);
    res.cookie('token', data.token, { httpOnly: true });
    return res.status(200).json({ data: data.message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
