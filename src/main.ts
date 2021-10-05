import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import { readFile } from 'fs/promises';
import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { join } from 'path';
import { makeElevOversigtSampleData } from './instrukdb/elevOversigt';
import { getTeamsHtml, TeamsPages } from './instrukdb/teams';


const getSSL = async () => {
  const key = (await readFile(join(__dirname, '../certificates/key.pem'))).toString();
  const cert = (await readFile(join(__dirname, '../certificates/cert.pem'))).toString();
  return {key, cert};
}

const getHttpPort = (fallback: number = 80) => {
  try {
    const httpEnv = process.env.HTTP!;
    return parseInt(httpEnv);
  } catch (catched) {
    console.log('Could not load HTTP port, falling back to', fallback);
    return fallback;
  }
}

const getHttpsPort = (fallback: number = 443) => {
  try {
    const httpsEnv = process.env.HTTPS!;
    return parseInt(httpsEnv);
  } catch (catched) {
    console.log('Could not load HTTPS port, falling back to', fallback);
    return fallback;
  }
}

const makeTestSamples = () => {
  makeElevOversigtSampleData();

  getTeamsHtml(TeamsPages.ItSupport);
  getTeamsHtml(TeamsPages.Programmør);
  getTeamsHtml(TeamsPages.Infrastruktur);
  getTeamsHtml(TeamsPages.Stab);
}

const main = async () => {
  const app = express();
  const httpServer = createHttpServer(app);
  const httpsServer = createHttpsServer(await getSSL(), app);

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.use('/', express.static(join(__dirname, '../public')));

  const [httpPort, httpsPort] = [getHttpPort(8080), getHttpsPort(8443)];
  httpServer.listen(httpPort, () => console.log(`Express HTTP at http://localhost:${httpPort}/`));
  httpsServer.listen(httpsPort, () => console.log(`Express HTTPS at https://localhost:${httpsPort}/`));

  // makeTestSamples();
}

config();
main().catch(error => console.error(error));
