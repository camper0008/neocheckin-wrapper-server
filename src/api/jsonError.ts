import { ErrorRequestHandler } from "express"

export const jsonError = () => {

  const jsonErrorMiddleware: ErrorRequestHandler =  async (err, req, res, next) => {
    if (err && err.type && err.type === 'entity.parse.failed')
      console.error(`${new Date().toISOString()} [API]: Recieved request with invalid JSON request body`);
    res.status(400).json({error: err})
  }

  return jsonErrorMiddleware;
}
