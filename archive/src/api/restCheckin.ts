import axios from "axios";
import { Response, Router, Request } from "express"
import { Agent as HttpsAgent } from "https";
import { Database } from "../database/Database";
import { Option } from "../models/Option"

namespace API {

  export type Handler<Q, S> = (req: Q, database: Database) => Promise<S>;
  export type RouteSetter = (router: Router, database: Database) => Router;

  export interface Employee {
    name: string,
    flex: number,
    working: boolean,
    department: string,
    photo: string,
  }
  
  export interface Option {
    id: number,
    name: string,
  }

  export interface Response {
    error?: string,
  }

  // GET /api/employee/:rfid
  export interface GetEmployeeRfidRequest {
    rfid?: string,
  }
  export interface GetEmployeeRfidResponse extends Response {
    employee?: API.Employee,
  }

  // POST /api/employee/cardscanned
  export interface PostEmployeeCardscannedRequest {
    employeeRfid?: string,
    checkingIn?: boolean,
    optionId?: number,
  }
  export interface PostEmployeeCardscannedResponse extends Response {
    employee?: API.Employee,
  }

  // GET /api/employees/working
  export interface GetEmployeesWorkingResponse extends Response {
    employees?: API.Employee[],
    ordered?: {[department: string]: API.Employee[]}
  }

  // GET /api/options/available
  export interface GetOptionsAvailableResponse extends Response {
    options?: API.Option[],
  }

}

const errorResponse = (error: unknown) => {
  if (error instanceof Error)
    return {error: `${error.name}: ${error.message}`};
  return {error: (error as any).toString()};
}

const stringToNumber = (s: string) => {
  const idNumber = parseInt(s);
  if (isNaN(idNumber))
    throw new Error(`string '${s}' not parseable and/or not valid number string`);
  return idNumber;
}

const isDef = (...v: any[]) => {
  for (let i in v)
    if (v[i] === undefined || v[i] === null || typeof v[i] === 'undefined')
      throw new Error(`value '${i}: ${v[i]}' is undefined`);
}

const getWorkingFromWorkingTimeString = (workingTimeString: string) => {
  return workingTimeString === 'Ikke logget ind';
}

const getBase64ImageFromElevId = async (id: number) => {
  const res = await axios.get(`https://instrukdb/elevbilled.php?id=${id}`, {
    responseType: 'arraybuffer',
    httpsAgent: new HttpsAgent({rejectUnauthorized: false}),
  });
  const image64 = Buffer.from(res.data, 'binary').toString('base64');
  return image64;
}

const getEmployeeRfid: API.Handler<API.GetEmployeeRfidRequest, API.GetEmployeeRfidResponse> =
async ({rfid}, database) => {
  try {
    // very T O D O, please remove
    await database.updateEmployeeById(1079, {rfid: '0'});
    await database.updateEmployeeById(1080, {rfid: '0328247262'});
    isDef(rfid);
    const employee = await database.getEmployeeByRfid(rfid!.toString());
    if (!employee)
      throw new Error(`Employee with rfid '${rfid}' not found`);
    return {
      employee: {
        name: employee.name,
        department: employee.department,
        flex: employee.flex.secondsTotal,
        working: getWorkingFromWorkingTimeString(employee.workTimeString),
        photo: await getBase64ImageFromElevId(employee.id),
      }
    }
  } catch (error) { return errorResponse(error); }
}

const postEmployeeCardscanned: API.Handler<API.PostEmployeeCardscannedRequest, API.PostEmployeeCardscannedResponse> = 
async ({checkingIn, employeeRfid, optionId}, database) => {
  try {
    isDef(checkingIn, employeeRfid, optionId);
    const options = await database.getAllActiveOptions();
    if (optionId === -1 && checkingIn)
      optionId = 0;
    let option: Option | null = null;
    for (let i in options)
      if (options[i].id === optionId)
        option = options[i];
    if (!option)
      throw new Error(`Option '${optionId}' is unknown/inactive`);
    const employee = await database.getEmployeeByRfid(employeeRfid!);
    if (!employee)
      throw new Error(`Employee with rfid '${employeeRfid}' unknown`);
    database.updateEmployeeById(employee.id, {status: checkingIn ? 'working' : 'not working', lastAction: option.name});
    console.log(employee)
    return {
      employee: {
        name: employee.name,
        department: employee.department,
        flex: employee.flex.secondsTotal,
        working: getWorkingFromWorkingTimeString(employee.workTimeString),
        photo: await getBase64ImageFromElevId(employee.id),
      }
    }
  } catch (error) { return errorResponse(error); }
}

const getApiEmployeesWorking: API.Handler<any, API.GetEmployeesWorkingResponse> = 
async ({}, database) => {
  try {
    const employees = await database.getAllEmployees();
    const employeesActive = employees.filter(({status}) => status === 'working');
    const apiEmployeesActive: API.Employee[] = await Promise.all(employeesActive.map(async (employee) => {
      return {
        name: employee.name,
        department: employee.department,
        flex: employee.flex.secondsTotal,
        working: getWorkingFromWorkingTimeString(employee.workTimeString),
        photo: await getBase64ImageFromElevId(employee.id),
      } as API.Employee
    }))

    return {
      employees: apiEmployeesActive,
    }
  } catch (error) { return errorResponse(error); }
}

const getOptionsAvailable: API.Handler<any, API.GetOptionsAvailableResponse> = 
async ({}, database) => {
  try {
    const options = await database.getAllActiveOptions();
    const apiOptions: API.Option[] = options.map(({id, name}) => ({id, name}));

    return {
      options: apiOptions,
    }
  } catch (error) { return errorResponse(error); }
}

const setGetEmployeeIdRoute: API.RouteSetter = (router, database) => {
  return router.get(
    '/employee/:id',
    async (
      req: Request<API.GetEmployeeRfidRequest>,
      res: Response<API.GetEmployeeRfidResponse>
    ) => {
      const id = req.params['rfid'];
      const result = await getEmployeeRfid({rfid: id}, database);
      return res.json(result);
    },
  );
}

const setEmployeeCardscannedRoute: API.RouteSetter = (router, database) => {
  return router.post(
    '/employee/cardscanned',
    async (
      req: Request<API.PostEmployeeCardscannedRequest>,
      res: Response<API.PostEmployeeCardscannedResponse>
    ) => {
      const result = await postEmployeeCardscanned(req.body, database);
      return res.json(result);
    },
  );
}

const setGetApiEmployeesWorkingRoute: API.RouteSetter = (router, database) => {
  return router.get(
    '/employees/working',
    async (
      req: Request,
      res: Response<API.GetEmployeesWorkingResponse>
    ) => {
      const result = await getApiEmployeesWorking(req, database);
      return res.json(result);
    }
  )
}

const setGetOptionsAvailableRoute: API.RouteSetter = (router, database) => {
  return router.get(
    '/options/available',
    async (
      req: Request,
      res: Response<API.GetOptionsAvailableResponse>
    ) => {
      const result = await getOptionsAvailable(req, database);
      return res.json(result);
    }
  )
}

export const restCheckinApi = (database: Database) => {
  const router = Router();
  setGetEmployeeIdRoute(router, database);
  setEmployeeCardscannedRoute(router, database);
  setGetApiEmployeesWorkingRoute(router, database);
  setGetOptionsAvailableRoute(router, database);
  return router;
}
