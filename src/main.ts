import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import { Express, json, urlencoded } from 'express';
import { readFile } from 'fs/promises';
import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { join } from 'path';

const getSSL = async () => {
  try {
    const key = (await readFile(join(__dirname, '../certificates/key.pem'))).toString();
    const cert = (await readFile(join(__dirname, '../certificates/cert.pem'))).toString();
    return {key, cert};
  } catch (error) {
    console.error(`Could not receive SSL certificates, try running 'generate_ssl_keys.sh' inside '/certificates'.`);
    return null;
  }
}

const getHttpPort = (fallback: number = 80) => {
  try {
    const httpEnv = process.env.HTTP!;
    if (typeof httpEnv !== 'string')
      throw new Error(`Could not find 'HTTP' variable in '.env'`)
    return parseInt(httpEnv);
  } catch (catched) {
    console.log('Could not load HTTP port from \'.env\', falling back to', fallback);
    return fallback;
  }
}

const getHttpsPort = (fallback: number = 443) => {
  try {
    const httpsEnv = process.env.HTTPS!;
    if (typeof httpsEnv !== 'string')
      throw new Error(`Could not find 'HTTP' variable in '.env'`)
    return parseInt(httpsEnv);
  } catch (catched) {
    console.log('Could not load HTTPS port from \'.env\', falling back to', fallback);
    return fallback;
  }
}

const serveHttp = async (app: Express) => {
  const port = getHttpPort(8080);
  const server = createHttpServer(app);
  server.listen(port, () => console.log(`Express HTTP at http://localhost:${port}/`));
}

const serveHttps = async (app: Express) => {
  const port = getHttpsPort(8443);
  const ssl = await getSSL();
  if (!ssl)
    return console.log('Aborting HTTPS server');
  const server = createHttpsServer(ssl, app);
  server.listen(port, () => console.log(`Express HTTPS at https://localhost:${port}/`));
}

const main = async () => {
  const app = express();


  app.use(cors());
  app.use(json());
  app.use(urlencoded({extended: true}));

  app.use('/', express.static(join(__dirname, '../public')));

  serveHttp(app);
  serveHttps(app);
}

config();
main().catch(error => console.error(error));
