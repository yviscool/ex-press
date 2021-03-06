/**
 * 'HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE' 封装
 */
import { WEB_ROUTER_KEY, attachClassMetadata } from './common';
import { MiddlewareParamArray } from './interface';

export interface RouterOption {
  path?: string;
  requestMethod: string;
  routerName?: string;
  method: string;
  middleware?: MiddlewareParamArray;
}

export const RequestMethod = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  PATCH: 'patch',
  ALL: 'all',
  OPTIONS: 'options',
  HEAD: 'head',
};

const PATH_METADATA = 'PATH_METADATA';
const METHOD_METADATA = 'METHOD_METADATA';
const ROUTER_MIDDLEWARE = 'ROUTER_MIDDLEWARE';

const defaultMetadata = {
  [PATH_METADATA]: '/',
  [METHOD_METADATA]: RequestMethod.GET,
  [ROUTER_MIDDLEWARE]: [],
};

export interface RequestMappingMetadata {
  [PATH_METADATA]?: string;
  [METHOD_METADATA]: string;
  [ROUTER_MIDDLEWARE]?: MiddlewareParamArray;
}

export const RequestMapping = (
  metadata: RequestMappingMetadata = defaultMetadata,
): MethodDecorator => {
  const path = metadata[PATH_METADATA] || '/';
  const requestMethod = metadata[METHOD_METADATA] || RequestMethod.GET;
  const middleware = metadata[ROUTER_MIDDLEWARE];

  return (target, key, descriptor: PropertyDescriptor) => {
    attachClassMetadata(WEB_ROUTER_KEY, {
      path,
      requestMethod,
      method: key,
      middleware,
    } as RouterOption, target);

    return descriptor;
  };
};

const createMappingDecorator = (method: string) => (
  path?: string,
  routerOptions: {
    middleware?: MiddlewareParamArray;
  } = { middleware: [] },
): MethodDecorator => {
  return RequestMapping({
    [PATH_METADATA]: path,
    [METHOD_METADATA]: method,
    [ROUTER_MIDDLEWARE]: routerOptions.middleware,
  });
};

/**
 * Routes HTTP POST requests to the specified path.
 */
export const Post = createMappingDecorator(RequestMethod.POST);

/**
 * Routes HTTP GET requests to the specified path.
 */
export const Get = createMappingDecorator(RequestMethod.GET);

/**
 * Routes HTTP DELETE requests to the specified path.
 */
export const Del = createMappingDecorator(RequestMethod.DELETE);

/**
 * Routes HTTP PUT requests to the specified path.
 */
export const Put = createMappingDecorator(RequestMethod.PUT);

/**
 * Routes HTTP PATCH requests to the specified path.
 */
export const Patch = createMappingDecorator(RequestMethod.PATCH);

/**
 * Routes HTTP OPTIONS requests to the specified path.
 */
export const Options = createMappingDecorator(RequestMethod.OPTIONS);

/**
 * Routes HTTP HEAD requests to the specified path.
 */
export const Head = createMappingDecorator(RequestMethod.HEAD);

/**
 * Routes all HTTP requests to the specified path.
 */
export const All = createMappingDecorator(RequestMethod.ALL);
