import { NextFunction, Request, Response } from 'express';

export const tokenAuth = (apiToken: string) => async (req: Request, res: Response, next: NextFunction) => {
  const token = (req.headers['token'] || req.query['token'] || req.body['token']) as string;
  if (token === apiToken)
    next();
  else
    res.status(400).json({error: 'access denied'})
}
