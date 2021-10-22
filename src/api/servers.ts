import { Express } from 'express';
import { readFile } from 'fs/promises';
import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { getHttpPort, getHttpsPort } from '../utils/env';

export const getSSL = async () => {
  try {
    const key = (await readFile('./certificates/key.pem')).toString();
    const cert = (await readFile('./certificates/cert.pem')).toString();
    return {key, cert};
  } catch (error) {
    console.error(`Could not receive SSL certificates, try running 'generate_ssl_keys.sh' inside '/certificates'.`);
    return null;
  }
}

export const serveHttp = async (app: Express) => {
  const port = getHttpPort(8080);
  const server = createHttpServer(app);
  server.listen(port, () => console.log(`Express HTTP at http://localhost:${port}/`));
}

export const serveHttps = async (app: Express) => {
  const port = getHttpsPort(8443);
  const ssl = await getSSL();
  if (!ssl)
    return console.log('Aborting HTTPS server');
  const server = createHttpsServer(ssl, app);
  server.listen(port, () => console.log(`Express HTTPS at https://localhost:${port}/`));
}
