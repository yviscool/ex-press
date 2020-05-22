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
  return async (req, res, next) => {
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

const createParamMapping = (type: RouteParamTypes) => {
  return (data?: any) => (target, key, index) => {
    attachPropertyDataToClass(WEB_ROUTER_PARAM_KEY, {
      index,
      type,
      data,
      extractValue: extractValue(type, data),
    }, target, key);
  };
};

export const Request = () => createParamMapping(RouteParamTypes.REQUEST)();
export const Response = () => createParamMapping(RouteParamTypes.RESPONSE)();
export const Res = () => createParamMapping(RouteParamTypes.RESPONSE)();
export const Session = () => createParamMapping(RouteParamTypes.SESSION)();
export const Body = (property?: string) => createParamMapping(RouteParamTypes.BODY)(property);
export const Query = (property?: string) => createParamMapping(RouteParamTypes.QUERY)(property);
export const Param = (property?: string) => createParamMapping(RouteParamTypes.PARAM)(property);
export const Headers = (property?: string) => createParamMapping(RouteParamTypes.HEADERS)(property);
export const File = (property?: string) => createParamMapping(RouteParamTypes.FILE)(property);
export const Files = () => createParamMapping(RouteParamTypes.FILES)();
export const Ip = () => createParamMapping(RouteParamTypes.IP)();
