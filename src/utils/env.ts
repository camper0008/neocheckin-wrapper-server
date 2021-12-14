
/* Example .env file

HTTP=8080
HTTPS=8443

LOW_LEVEL_API_KEY=XXXXXXXX

TOKEN=XXXXX

*/

export const getHttpPort = (fallback: number) => {
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

export const getHttpsPort = (fallback: number) => {
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


export const getLowLevelApiKey = (fallback: string) => {
  try {
    const apiKey = process.env.LOW_LEVEL_API_KEY!;
    if (typeof apiKey !== 'string')
      throw new Error(`Could not find 'LOW_LEVEL_API_KEY' variable in '.env'`)
    return apiKey;
  } catch (catched) {
    console.log('Could not load LOW_LEVEL_API_KEY port from \'.env\', falling back to', fallback);
    return fallback;
  }
}

export const getApiToken = () => {
  const apiKey = process.env.API_TOKEN!;
  if (typeof apiKey !== 'string')
    throw new Error(`Could not find 'API_TOKEN' variable in '.env'`)
  return apiKey;
}

export const getInstrukdbUrl = () => {
  const apiKey = process.env.INSTRUKDB_URL!;
  if (typeof apiKey !== 'string')
    throw new Error(`Could not find 'INSTRUKDB_URL' variable in '.env'`)
  return apiKey;
}
