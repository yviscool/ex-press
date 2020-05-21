import { attachPropertyDataToClass } from 'injection';
import { WEB_ROUTER_PARAM_KEY } from './constant';


export enum RouteParamTypes {
  REQUEST,
  RESPONSE,
  QUERY,
  BODY,
  PARAM,
  HEADERS,
  SESSION,
  FILE,
  FILES,
  NEXT,
  IP,
}

export interface RouterParamValue {
  index?: number;
  type?: RouteParamTypes;
  data?: any;
  extractValue?: (ctx, next) => Promise<any>;
}

export const extractValue = function extractValue(key, data) {
  return async function (req, res, next) {
    switch (key) {
      case RouteParamTypes.NEXT:
        return next;
      case RouteParamTypes.REQUEST:
        return req as any;
      case RouteParamTypes.RESPONSE:
        return res as any;
      case RouteParamTypes.BODY:
        return data && req.body ? req.body[data] : req.body;
      case RouteParamTypes.PARAM:
        return data ? req.params[data] : req.params;
      case RouteParamTypes.QUERY:
        return data ? req.query[data] : req.query;
      case RouteParamTypes.HEADERS:
        return data ? req.headers[data] : req.headers;
      case RouteParamTypes.SESSION:
        return req.session;
      case RouteParamTypes.FILE:
        return req[data || 'file'];
      case RouteParamTypes.FILES:
        return req.files;
      case RouteParamTypes.IP:
        return req.ip;
      default:
        return null;
    }
  };
};

const createParamMapping = function (type: RouteParamTypes) {
  return (data?: any) => (target, key, index) => {
    attachPropertyDataToClass(WEB_ROUTER_PARAM_KEY, {
      index,
      type,
      data,
      extractValue: extractValue(type, data)
    }, target, key);
  };
};

export const session = () => createParamMapping(RouteParamTypes.SESSION)();
export const body = (property?: string) => createParamMapping(RouteParamTypes.BODY)(property);
export const query = (property?: string) => createParamMapping(RouteParamTypes.QUERY)(property);
export const param = (property?: string) => createParamMapping(RouteParamTypes.PARAM)(property);
export const headers = (property?: string) => createParamMapping(RouteParamTypes.HEADERS)(property);
export const file = (property?: string) => createParamMapping(RouteParamTypes.FILE)(property);
export const files = () => createParamMapping(RouteParamTypes.FILES)();
export const Ip = () => createParamMapping(RouteParamTypes.IP)();
