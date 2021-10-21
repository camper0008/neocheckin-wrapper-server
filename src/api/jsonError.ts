import { ErrorRequestHandler } from "express"

export const jsonError = () => {

  const jsonErrorMiddleware: ErrorRequestHandler =  async (err, req, res, next) => {
    res.status(400).json({error: err})
  }

  return jsonErrorMiddleware;
}
