import { Request, Response } from 'express';

export function register(req: Request, res: Response) {
  res.send('register');
}

export function login(req: Request, res: Response) {
  res.send('login');
}

export function getUser(req: Request, res: Response) {
  res.send('getUser');
}

export function updateUser(req: Request, res: Response) {
  res.send('updateUser');
}

export function deleteUser(req: Request, res: Response) {
  res.send('deleteUser');
}
